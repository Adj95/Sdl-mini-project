'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { voiceCommandToAction } from '@/ai/flows/voice-command-to-action';
import { updateDeviceStatus } from '@/lib/api/devices';
import type { Device } from '@/types';

// Web Speech API interfaces
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

type VoiceControlProps = {
  devices: Device[];
};

export default function VoiceControl({ devices }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(finalTranscript + interimTranscript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        toast({
          title: 'Voice Error',
          description: `An error occurred: ${event.error}`,
          variant: 'destructive',
        });
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start(); // Restart if it stops unexpectedly
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.warn('Speech Recognition not supported in this browser.');
    }
  }, [toast, isListening]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (transcript.trim()) {
        handleVoiceCommand(transcript);
      }
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (transcript.trim()) {
        handleVoiceCommand(transcript);
      } else {
        setIsProcessing(false);
      }
    } else if (open) {
      setTranscript('');
      setIsProcessing(false);
    }
  };


  const handleVoiceCommand = async (command: string) => {
    if (!command.trim()) return;
    setIsProcessing(true);
    try {
      const simplifiedDevices = devices.map(d => ({ _id: d._id, name: d.name, type: d.type }));
      const action = await voiceCommandToAction({ voiceCommand: command, devices: simplifiedDevices });
      
      const targetDevice = devices.find(d =>
        d.name.toLowerCase() === action.deviceName.toLowerCase()
      );

      if (!targetDevice) {
        throw new Error(`Device "${action.deviceName}" not found.`);
      }

      let newStatus: Partial<Device['status']> = {};
      if (action.action === 'on' || action.action === 'off') {
        newStatus.isOn = action.action === 'on';
      } else if (targetDevice.type === 'fan' && action.action.includes('speed')) {
        newStatus.speed = action.value;
      } else if (targetDevice.type === 'ac' && (action.action.includes('temperature') || action.action.includes('set'))) {
        newStatus.temperature = action.value;
      } else if (targetDevice.type === 'door' && (action.action === 'open' || action.action === 'close')) {
         newStatus.isOpen = action.action === 'open';
      } else {
        throw new Error(`Action "${action.action}" is not applicable to device "${targetDevice.name}".`);
      }
      
      await updateDeviceStatus(targetDevice._id, newStatus);

      toast({
        title: 'Voice Command Executed',
        description: `Performed '${action.action}' on ${targetDevice.name}.`,
      });
      handleOpenChange(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('Error processing voice command:', error);
      toast({
        title: 'Voice Command Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setTranscript('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <Mic className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Voice Control</DialogTitle>
          <DialogDescription>
            {isListening ? "I'm listening... Speak your command." : "Press the microphone to start speaking."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-4 py-8">
            <Button
              size="icon"
              className={cn("h-24 w-24 rounded-full transition-all duration-300", isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-primary hover:bg-primary/90")}
              onClick={toggleListening}
              disabled={isProcessing}
            >
            {isProcessing ? (
                <LoaderCircle className="h-10 w-10 animate-spin" />
            ) : isListening ? (
                <MicOff className="h-10 w-10" />
            ) : (
                <Mic className="h-10 w-10" />
            )}
            </Button>
            <p className="min-h-[2rem] text-center text-lg font-medium text-muted-foreground">
                {transcript || (isProcessing ? 'Processing...' : '...')}
            </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button onClick={() => handleVoiceCommand(transcript)} disabled={!transcript || isProcessing}>
            {isProcessing ? 'Processing...' : 'Execute Command'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

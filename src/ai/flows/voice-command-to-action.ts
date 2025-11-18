'use server';

import {z} from 'zod';

const VoiceCommandToActionInputSchema = z.object({
  voiceCommand: z.string().describe('The voice command to interpret.'),
  devices: z.array(z.object({
    _id: z.string(),
    name: z.string(),
    type: z.string(),
  })).describe('A list of available devices to control.'),
});
export type VoiceCommandToActionInput = z.infer<
  typeof VoiceCommandToActionInputSchema
>;

const VoiceCommandToActionOutputSchema = z.object({
  deviceName: z.string().describe('The name of the device to control.'),
  action: z
    .string()
    .describe(
      'The action to perform on the device (e.g., on, off, set temperature).'
    ),
  value: z
    .number()
    .optional()
    .describe('The value to set for the action, if applicable.'),
});
export type VoiceCommandToActionOutput = z.infer<
  typeof VoiceCommandToActionOutputSchema
>;

// Fast mock implementation - no Genkit overhead
export async function voiceCommandToAction(
  input: VoiceCommandToActionInput
): Promise<VoiceCommandToActionOutput> {
  const command = input.voiceCommand.toLowerCase();
  
  // Simple pattern matching for common commands
  if (command.includes('light') && command.includes('on')) {
    return {
      deviceName: 'Living Room Light',
      action: 'on',
      value: undefined,
    };
  }
  
  if (command.includes('light') && command.includes('off')) {
    return {
      deviceName: 'Living Room Light',
      action: 'off',
      value: undefined,
    };
  }
  
  if (command.includes('thermostat') || command.includes('temperature')) {
    const tempMatch = command.match(/(\d+)/);
    return {
      deviceName: 'Thermostat',
      action: 'set',
      value: tempMatch ? parseInt(tempMatch[1]) : 72,
    };
  }
  
  if (command.includes('fan')) {
    return {
      deviceName: 'Fan',
      action: command.includes('on') ? 'on' : 'off',
      value: undefined,
    };
  }

  // Default response
  return {
    deviceName: input.devices[0]?.name || 'Unknown Device',
    action: 'on',
    value: undefined,
  };
}

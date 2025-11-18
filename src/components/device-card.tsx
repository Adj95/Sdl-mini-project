'use client';

import { Lightbulb, Fan, AirVent, DoorOpen, DoorClosed, Power, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Device } from '@/types';
import { updateDeviceStatus } from '@/lib/api/devices';
import { useToast } from '@/hooks/use-toast';

type DeviceCardProps = {
  device: Device;
  onUpdate: (deviceId: string, newStatus: Partial<Device['status']>) => void;
};

const deviceIcons: { [key in Device['type']]: React.ElementType } = {
  light: Lightbulb,
  fan: Fan,
  ac: AirVent,
  door: DoorOpen,
};

export default function DeviceCard({ device, onUpdate }: DeviceCardProps) {
  const { toast } = useToast();

  const handleToggle = async (checked: boolean) => {
    const newStatus = { isOn: checked };
    onUpdate(device._id, newStatus); // Optimistic update
    try {
      await updateDeviceStatus(device._id, newStatus);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update device.', variant: 'destructive' });
      onUpdate(device._id, { isOn: !checked }); // Revert on failure
    }
  };

  const handleSliderChange = (value: number[]) => {
    let newStatus: Partial<Device['status']> = {};
    if (device.type === 'fan') newStatus = { speed: value[0] };
    if (device.type === 'ac') newStatus = { temperature: value[0] };
    onUpdate(device._id, newStatus);
  };

  const handleSliderCommit = async (value: number[]) => {
    let newStatus: Partial<Device['status']> = {};
    if (device.type === 'fan') newStatus = { speed: value[0] };
    if (device.type === 'ac') newStatus = { temperature: value[0] };
    try {
      await updateDeviceStatus(device._id, newStatus);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update device setting.', variant: 'destructive' });
      // Note: Reverting slider is tricky, might need previous state. For now, we rely on refetch.
    }
  };

  const handleDoorToggle = async () => {
    const newStatus = { isOpen: !device.status.isOpen };
     onUpdate(device._id, newStatus); // Optimistic update
    try {
      await updateDeviceStatus(device._id, newStatus);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update door status.', variant: 'destructive' });
      onUpdate(device._id, { isOpen: !newStatus.isOpen }); // Revert
    }
  };

  const Icon = device.type === 'door' ? (device.status.isOpen ? DoorOpen : DoorClosed) : (deviceIcons[device.type] || Zap);

  const isUnavailable = device.type !== 'door' && !device.status.isOn;

  return (
    <Card className={cn('flex flex-col transition-all duration-300', isUnavailable && 'bg-muted/50')}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{device.name}</CardTitle>
        <Icon className={cn('h-6 w-6', device.status.isOn ? 'text-primary' : 'text-muted-foreground')} />
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {device.type === 'light' && (
           <div className="flex items-center justify-center py-4">
             <Badge variant={device.status.isOn ? 'default' : 'secondary'}>
               {device.status.isOn ? 'On' : 'Off'}
             </Badge>
           </div>
        )}
        {device.type === 'fan' && (
          <div className="space-y-2">
            <Slider
              defaultValue={[device.status.speed || 0]}
              max={100}
              step={10}
              onValueChange={handleSliderChange}
              onValueCommit={handleSliderCommit}
              disabled={isUnavailable}
            />
            <p className="text-center text-sm text-muted-foreground">Speed: {device.status.speed || 0}%</p>
          </div>
        )}
        {device.type === 'ac' && (
          <div className="space-y-2">
            <Slider
              defaultValue={[device.status.temperature || 22]}
              max={30}
              min={16}
              step={1}
              onValueChange={handleSliderChange}
              onValueCommit={handleSliderCommit}
              disabled={isUnavailable}
            />
            <p className="text-center text-sm text-muted-foreground">Temp: {device.status.temperature || 22}°C</p>
          </div>
        )}
        {device.type === 'door' && (
            <div className="flex items-center justify-center py-4">
                 <Badge variant={device.status.isOpen ? 'destructive' : 'default'} className="cursor-pointer" onClick={handleDoorToggle}>
                    {device.status.isOpen ? 'Open' : 'Closed'}
                </Badge>
            </div>
        )}

      </CardContent>
      <CardFooter>
        {device.type !== 'door' ? (
          <Switch
            className="ml-auto"
            checked={device.status.isOn}
            onCheckedChange={handleToggle}
            aria-label={`Toggle ${device.name}`}
          />
        ) : (
            <Button className="w-full" onClick={handleDoorToggle}>
                {device.status.isOpen ? 'Close Door' : 'Open Door'}
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}

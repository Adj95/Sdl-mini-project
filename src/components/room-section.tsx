'use client';

import type { Device, Room } from '@/types';
import DeviceCard from './device-card';

type RoomSectionProps = {
  room: Room;
  devices: Device[];
  onDeviceUpdate: (deviceId: string, newStatus: Partial<Device['status']>) => void;
};

export default function RoomSection({ room, devices, onDeviceUpdate }: RoomSectionProps) {
  return (
    <div id={room.name.toLowerCase().replace(' ', '-')}>
      <h2 className="text-2xl font-bold tracking-tight mb-4">{room.name}</h2>
      {devices.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {devices.map((device) => (
            <DeviceCard key={device._id} device={device} onUpdate={onDeviceUpdate} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-24 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30">
            <p className="text-sm text-muted-foreground">No devices in this room.</p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState, useMemo } from 'react';
import useSWR from 'swr';
import RoomSection from '@/components/room-section';
import { getDevices } from '@/lib/api/devices';
import type { Device } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ZapOff, Lightbulb, Thermometer } from 'lucide-react';

// A placeholder for room data, assuming it would come from an API
const getRooms = async () => [
    { _id: 'living-room', name: 'Living Room' },
    { _id: 'bedroom', name: 'Bedroom' },
    { _id: 'kitchen', name: 'Kitchen' },
    { _id: 'office', name: 'Office' },
];

export default function DashboardPage() {
  const { data: devicesData, error, mutate } = useSWR('devices', getDevices);
  const [devices, setDevices] = useState<Device[] | undefined>(devicesData);
  const [rooms, setRooms] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    if(devicesData) {
      setDevices(devicesData);
    }
  }, [devicesData]);

  useEffect(() => {
    getRooms().then(setRooms);
  }, []);

  const handleDeviceUpdate = (deviceId: string, newStatus: Partial<Device['status']>) => {
    setDevices(prevDevices =>
      prevDevices?.map(d =>
        d._id === deviceId ? { ...d, status: { ...d.status, ...newStatus } } : d
      )
    );
  };

  const groupedDevices = useMemo(() => {
    if (!devices) return {};
    return devices.reduce((acc, device) => {
      (acc[device.room] = acc[device.room] || []).push(device);
      return acc;
    }, {} as { [key: string]: Device[] });
  }, [devices]);

  const stats = useMemo(() => {
    if (!devices) return { total: 0, active: 0, power: 0 };
    const activeDevices = devices.filter(d => d.status.isOn);
    const totalPower = activeDevices.reduce((sum, d) => sum + d.powerRating, 0);
    return {
        total: devices.length,
        active: activeDevices.length,
        power: totalPower
    };
  }, [devices]);

  const isLoading = !devicesData && !error;

  const renderLoadingSkeleton = () => (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i}>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          </div>
        ))}
      </div>
  );

  if (isLoading) {
    return renderLoadingSkeleton();
  }

  if (error) {
    return (
        <div className="flex items-center justify-center h-full rounded-lg bg-card border border-destructive/50 p-8">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-destructive">Failed to load devices</h2>
                <p className="text-muted-foreground">Please check your connection and try again.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                    <Lightbulb className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">in your entire home</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.active}</div>
                    <p className="text-xs text-muted-foreground">{((stats.active / stats.total) * 100 || 0).toFixed(0)}% of total</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inactive Devices</CardTitle>
                    <ZapOff className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total - stats.active}</div>
                     <p className="text-xs text-muted-foreground">Ready to be activated</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Power Consumption</CardTitle>
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.power} W</div>
                    <p className="text-xs text-muted-foreground">Current total power draw</p>
                </CardContent>
            </Card>
        </div>
      {rooms.map((room) => (
        <RoomSection
          key={room._id}
          room={room}
          devices={groupedDevices[room.name] || []}
          onDeviceUpdate={handleDeviceUpdate}
        />
      ))}
    </div>
  );
}

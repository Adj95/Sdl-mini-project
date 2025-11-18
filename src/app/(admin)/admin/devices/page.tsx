'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminGetDevices, adminDeleteDevice } from '@/lib/api/devices';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import AddEditDeviceDialog from '@/components/add-edit-device-dialog';
import { Device } from '@/types';

export default function AdminDevicesPage() {
    const { data: devices, error, mutate, isLoading } = useSWR('admin/devices', adminGetDevices);
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this device?')) return;
        try {
            await adminDeleteDevice(id);
            toast({ title: 'Success', description: 'Device deleted.' });
            mutate();
        } catch (err) {
            toast({ title: 'Error', description: 'Failed to delete device.', variant: 'destructive' });
        }
    };

    const handleAddClick = () => {
        setSelectedDevice(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (device: Device) => {
        setSelectedDevice(device);
        setIsDialogOpen(true);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Device Management</CardTitle>
                    <CardDescription>Add, edit, or remove devices from the system.</CardDescription>
                </div>
                <Button onClick={handleAddClick}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Device
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Power (W)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && [...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                            </TableRow>
                        ))}
                        {error && <TableRow><TableCell colSpan={5} className="text-center text-destructive">Failed to load devices.</TableCell></TableRow>}
                        {devices && devices.map((device) => (
                            <TableRow key={device._id}>
                                <TableCell className="font-medium">{device.name}</TableCell>
                                <TableCell><Badge variant="secondary">{device.type}</Badge></TableCell>
                                <TableCell>{device.room}</TableCell>
                                <TableCell>{device.powerRating}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(device)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(device._id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {isDialogOpen && (
                    <AddEditDeviceDialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        device={selectedDevice}
                        onSuccess={() => {
                            setIsDialogOpen(false);
                            mutate();
                        }}
                    />
                )}
            </CardContent>
        </Card>
    );
}

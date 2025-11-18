'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Device } from '@/types';
import { adminCreateDevice, adminUpdateDevice } from '@/lib/api/devices';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';

const deviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['light', 'fan', 'ac', 'door']),
  room: z.string().min(1, 'Room is required'),
  powerRating: z.coerce.number().min(0, 'Power rating must be a positive number'),
});

type DeviceFormValues = z.infer<typeof deviceSchema>;

interface AddEditDeviceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  onSuccess: () => void;
}

export default function AddEditDeviceDialog({ isOpen, onClose, device, onSuccess }: AddEditDeviceDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      name: device?.name || '',
      type: device?.type || 'light',
      room: device?.room || '',
      powerRating: device?.powerRating || 0,
    },
  });

  const onSubmit = async (values: DeviceFormValues) => {
    setIsSubmitting(true);
    try {
      if (device) {
        await adminUpdateDevice(device._id, values);
        toast({ title: 'Success', description: 'Device updated successfully.' });
      } else {
        await adminCreateDevice(values);
        toast({ title: 'Success', description: 'Device created successfully.' });
      }
      onSuccess();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save device.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{device ? 'Edit Device' : 'Add New Device'}</DialogTitle>
          <DialogDescription>
            Fill in the details for the device below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Living Room Lamp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a device type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="fan">Fan</SelectItem>
                      <SelectItem value="ac">Air Conditioner</SelectItem>
                      <SelectItem value="door">Door</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Living Room">Living Room</SelectItem>
                      <SelectItem value="Bedroom">Bedroom</SelectItem>
                      <SelectItem value="Kitchen">Kitchen</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Bathroom">Bathroom</SelectItem>
                      <SelectItem value="Garage">Garage</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="powerRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Power Rating (Watts)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 60" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {device ? 'Save Changes' : 'Create Device'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

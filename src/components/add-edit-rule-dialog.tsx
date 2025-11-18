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
import { AutomationRule, Device } from '@/types';
import { createRule, updateRule } from '@/lib/api/rules';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';

const ruleSchema = z.object({
  name: z.string().min(1, 'Rule name is required'),
  deviceId: z.string().min(1, 'Please select a device'),
  action: z.object({
    type: z.enum(['on', 'off']),
  }),
  trigger: z.object({
    type: z.literal('time'),
    value: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)'),
  }),
});

type RuleFormValues = z.infer<typeof ruleSchema>;

interface AddEditRuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rule: AutomationRule | null;
  devices: Device[];
  onSuccess: () => void;
}

export default function AddEditRuleDialog({ isOpen, onClose, rule, devices, onSuccess }: AddEditRuleDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<RuleFormValues>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      name: rule?.name || '',
      deviceId: rule?.deviceId || '',
      action: {
        type: rule?.action.type === 'on' || rule?.action.type === 'off' ? rule.action.type : 'on',
      },
      trigger: {
        type: 'time',
        value: rule?.trigger.value || '',
      },
    },
  });

  const onSubmit = async (values: RuleFormValues) => {
    setIsSubmitting(true);
    try {
      if (rule) {
        await updateRule(rule._id, values);
        toast({ title: 'Success', description: 'Rule updated successfully.' });
      } else {
        await createRule(values);
        toast({ title: 'Success', description: 'Rule created successfully.' });
      }
      onSuccess();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save rule.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit Automation Rule' : 'Create New Rule'}</DialogTitle>
          <DialogDescription>
            Automate your devices by setting up triggers and actions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'Turn on evening lights'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="trigger.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trigger Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="action.type"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Action</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an action" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="on">Turn On</SelectItem>
                                <SelectItem value="off">Turn Off</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
              control={form.control}
              name="deviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a device to control" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {devices.map(device => (
                        <SelectItem key={device._id} value={device._id}>
                          {device.name} ({device.room})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                {rule ? 'Save Changes' : 'Create Rule'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

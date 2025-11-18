'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { PlusCircle, Bot, Edit, Trash2, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { getRules, deleteRule } from '@/lib/api/rules';
import { getDevices } from '@/lib/api/devices';
import { Skeleton } from '@/components/ui/skeleton';
import AddEditRuleDialog from '@/components/add-edit-rule-dialog';
import { AutomationRule, Device } from '@/types';

export default function AutomationPage() {
  const { data: rules, error: rulesError, mutate, isLoading: isLoadingRules } = useSWR('rules', getRules);
  const { data: devices, error: devicesError, isLoading: isLoadingDevices } = useSWR('devices', getDevices);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteRule(id);
      toast({ title: 'Success', description: 'Rule deleted successfully.' });
      mutate();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete rule.', variant: 'destructive' });
    }
  };

  const handleAddClick = () => {
    setSelectedRule(null);
    setIsDialogOpen(true);
  };
  
  const handleEditClick = (rule: AutomationRule) => {
    setSelectedRule(rule);
    setIsDialogOpen(true);
  };

  const getDeviceName = (deviceId: string) => {
    return devices?.find((d: Device) => d._id === deviceId)?.name || 'Unknown Device';
  }

  const isLoading = isLoadingRules || isLoadingDevices;
  const error = rulesError || devicesError;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Automation Rules</CardTitle>
          <CardDescription>Manage your smart home automations to streamline your life.</CardDescription>
        </div>
        <Button onClick={handleAddClick} disabled={isLoading || !!error}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Rule
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
        ) : error ? (
            <div className="text-center text-destructive py-10">Failed to load automation data.</div>
        ) : rules && rules.length > 0 && devices ? (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule._id} className="flex items-center justify-between rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{rule.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4"/>
                            <span>{rule.trigger.value}</span>
                        </div>
                         <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4"/>
                            <span>Turns {rule.action.type.toUpperCase()} <span className="font-medium text-foreground">{getDeviceName(rule.deviceId)}</span></span>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(rule)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the automation rule &quot;{rule.name}&quot;.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(rule._id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
            <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Automation Rules Found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Automate your home by creating a new rule.
            </p>
            <Button onClick={handleAddClick}>Create Rule</Button>
          </div>
        )}
      </CardContent>
       {isDialogOpen && (
         <AddEditRuleDialog
           isOpen={isDialogOpen}
           onClose={() => setIsDialogOpen(false)}
           rule={selectedRule}
           devices={devices || []}
           onSuccess={() => {
             setIsDialogOpen(false);
             mutate();
           }}
         />
       )}
    </Card>
  );
}

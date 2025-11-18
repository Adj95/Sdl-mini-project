'use client';

import useSWR from 'swr';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getLogs } from '@/lib/api/logs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { User, Bot } from 'lucide-react';

export default function LogsPage() {
  const { data: logs, error, isLoading } = useSWR('logs', getLogs);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Logs</CardTitle>
        <CardDescription>A log of all recent device activities.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Triggered By</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-28 ml-auto" /></TableCell>
                </TableRow>
            ))}
            {error && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-destructive">Failed to load logs.</TableCell>
                </TableRow>
            )}
            {logs && logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell className="font-medium">{log.device.name}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex w-fit items-center gap-2">
                        {log.triggeredBy.type === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                        <span>{log.triggeredBy.name}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))
            ) : (!isLoading &&
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

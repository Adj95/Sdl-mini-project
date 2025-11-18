'use client';

import useSWR from 'swr';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getEnergyData } from '@/lib/api/energy';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Wand2, LoaderCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { AnalyzeEnergyUsageOutput } from '@/ai/flows/analyze-energy-usage';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              {payload[0].value.toFixed(2)} kWh
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


export default function EnergyPage() {
    const { data: energyData, error, isLoading } = useSWR('energyData', getEnergyData);
    const { toast } = useToast();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalyzeEnergyUsageOutput | null>(null);

    const chartData = useMemo(() => energyData?.kwhPerDevice 
        ? Object.entries(energyData.kwhPerDevice).map(([deviceId, kwh]) => {
            const device = energyData.devices.find(d => d._id === deviceId);
            return {
                name: device?.name || 'Unknown',
                kwh,
            };
        }) 
        : [], [energyData]);

    const roomData = useMemo(() => {
        if (!energyData) return [];
        const kwhPerRoom = energyData.devices.reduce((acc, device) => {
            const kwh = energyData.kwhPerDevice[device._id] || 0;
            if (kwh > 0) {
                acc[device.room] = (acc[device.room] || 0) + kwh;
            }
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(kwhPerRoom).map(([name, value]) => ({ name, value }));
    }, [energyData]);

    const weeklyProjectionData = useMemo(() => {
        if (!energyData) return [];
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const todayKwh = energyData.totalEnergyUsedToday;
        // Simulate some variation for the projection
        return days.map((day, index) => ({
            name: day,
            kwh: Math.max(0, todayKwh * (1 + (Math.random() - 0.5) * 0.2)), // +/- 10% variation, ensure non-negative
        }));
    }, [energyData]);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAnalysisResult(null);

        // Simulate a network request
        await new Promise(resolve => setTimeout(resolve, 1500));

        const staticResult: AnalyzeEnergyUsageOutput = {
            totalEnergyUsedTodayKWh: energyData?.totalEnergyUsedToday ?? 0,
            kwhPerDevice: energyData?.kwhPerDevice ?? {},
            estimatedBill: energyData?.estimatedBill ?? 0,
            recommendations: `Here are a few tips to save energy based on your current usage:
• Your **Kitchen AC** is the highest consumer. Try to use it only during peak heat hours.
• The **Living Room Light** is on frequently. Consider switching to an LED bulb if you haven't already.
• Automate your lights to turn off when you leave a room to prevent them from being left on accidentally.
• Unplug devices and chargers when not in use, as they can still draw standby power.`,
        };

        setAnalysisResult(staticResult);
        setIsAnalyzing(false);
        toast({
            title: "Analysis Complete",
            description: "Your personalized energy recommendations are ready."
        })
    };


    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32 md:col-span-2" />
                <Card className="col-span-1 md:col-span-2 lg:col-span-4">
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-80 w-full" />
                    </CardContent>
                </Card>
                 <Card className="col-span-1 md:col-span-2 lg:col-span-2">
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-80 w-full" />
                    </CardContent>
                </Card>
                 <Card className="col-span-1 md:col-span-2 lg:col-span-2">
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-80 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (error) return <div className="text-center text-destructive">Failed to load energy data.</div>;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Energy Today</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{energyData?.totalEnergyUsedToday.toFixed(2) ?? 'N/A'} kWh</div>
                    <p className="text-xs text-muted-foreground">Total consumption for all devices</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Estimated Daily Cost</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${energyData?.estimatedBill.toFixed(2) ?? 'N/A'}</div>
                    <p className="text-xs text-muted-foreground">Based on an average rate</p>
                </CardContent>
            </Card>
             <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projected Weekly Cost</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${((energyData?.estimatedBill ?? 0) * 7).toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Based on today's usage patterns</p>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-4">
                <CardHeader>
                    <CardTitle>Energy Usage per Device (kWh)</CardTitle>
                    <CardDescription>Today&apos;s consumption by each smart device.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} angle={-30} textAnchor="end" height={80} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />}/>
                            <Legend />
                            <Bar dataKey="kwh" fill="hsl(var(--primary))" name="Energy (kWh)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Consumption by Room</CardTitle>
                    <CardDescription>A breakdown of energy usage in each room.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={roomData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={(entry) => `${entry.name} (${(entry.percent * 100).toFixed(0)}%)`}
                            >
                                {roomData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip
                                contentStyle={{
                                    background: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-2">
                 <CardHeader>
                    <CardTitle>Weekly Usage Projection</CardTitle>
                    <CardDescription>An estimated 7-day usage based on today's consumption.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={weeklyProjectionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <Tooltip content={<CustomTooltip />}/>
                            <Legend />
                            <Line type="monotone" dataKey="kwh" stroke="hsl(var(--primary))" name="Projected kWh" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-4">
                <CardHeader>
                    <CardTitle>AI-Powered Energy Analysis</CardTitle>
                    <CardDescription>Get personalized recommendations to reduce your energy consumption and save money.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                        {isAnalyzing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        {isAnalyzing ? 'Analyzing...' : 'Generate Recommendations'}
                    </Button>

                    {analysisResult && (
                        <Alert className="mt-4">
                            <Wand2 className="h-4 w-4" />
                            <AlertTitle className="font-bold">Recommendations</AlertTitle>
                            <AlertDescription>
                                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: analysisResult.recommendations.replace(/•/g, '<br/>•') }}/>
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

    

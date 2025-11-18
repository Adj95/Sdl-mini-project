'use server';

/**
 * @fileOverview This file defines a fast mock implementation for energy usage analysis.
 */

import {z} from 'zod';

// Define the input schema
const AnalyzeEnergyUsageInputSchema = z.object({
  devicePowerRatings: z
    .record(z.number())
    .describe(
      'A map of device names to their power ratings in watts (e.g., {light: 60, fan: 75})'
    ),
  usageHours: z
    .record(z.number())
    .describe(
      'A map of device names to their daily usage hours (e.g., {light: 4, fan: 8})'
    ),
  energyRate: z
    .number()
    .describe('The cost of electricity in your area, in dollars per kWh'),
});
export type AnalyzeEnergyUsageInput = z.infer<typeof AnalyzeEnergyUsageInputSchema>;

// Define the output schema
const AnalyzeEnergyUsageOutputSchema = z.object({
  totalEnergyUsedTodayKWh: z
    .number()
    .describe('Total energy used today in kilowatt-hours (kWh).'),
  kwhPerDevice: z
    .record(z.number())
    .describe('Energy consumption per device in kWh.'),
  estimatedBill: z
    .number()
    .describe('Estimated electricity bill for the day based on the provided data.'),
  recommendations: z
    .string()
    .describe(
      'Personalized recommendations to reduce energy consumption and lower the electricity bill.'
    ),
});
export type AnalyzeEnergyUsageOutput = z.infer<typeof AnalyzeEnergyUsageOutputSchema>;

/**
 * Fast mock implementation - Analyzes energy usage without Genkit overhead
 */
export async function analyzeEnergyUsage(input: AnalyzeEnergyUsageInput): Promise<AnalyzeEnergyUsageOutput> {
  const kwhPerDevice: Record<string, number> = {};
  let totalEnergyKWh = 0;

  // Calculate energy usage per device
  for (const [device, watts] of Object.entries(input.devicePowerRatings)) {
    const hours = input.usageHours[device] || 0;
    const kwh = (watts * hours) / 1000;
    kwhPerDevice[device] = kwh;
    totalEnergyKWh += kwh;
  }

  const estimatedBill = totalEnergyKWh * input.energyRate;

  // Generate recommendations based on usage patterns
  const highEnergyDevices = Object.entries(kwhPerDevice)
    .filter(([_, kwh]) => kwh > totalEnergyKWh * 0.2)
    .map(([device]) => device);

  let recommendations = 'Here are personalized recommendations to reduce your energy consumption:\n\n';
  
  if (highEnergyDevices.length > 0) {
    recommendations += `1. High Energy Consumers: ${highEnergyDevices.join(', ')} are consuming significant energy.\n`;
    recommendations += '   - Consider upgrading to energy-efficient models or using them less frequently.\n\n';
  }

  recommendations += '2. General Tips:\n';
  recommendations += '   - Use LED lighting instead of incandescent bulbs\n';
  recommendations += '   - Set thermostat to optimal temperatures (68°F in winter, 78°F in summer)\n';
  recommendations += '   - Unplug devices when not in use\n';
  recommendations += '   - Use power strips to eliminate phantom energy drain\n\n';
  recommendations += `3. Estimated monthly savings with 20% reduction: $${(estimatedBill * 0.2 * 30).toFixed(2)}`;

  return {
    totalEnergyUsedTodayKWh: Math.round(totalEnergyKWh * 100) / 100,
    kwhPerDevice,
    estimatedBill: Math.round(estimatedBill * 100) / 100,
    recommendations,
  };
}

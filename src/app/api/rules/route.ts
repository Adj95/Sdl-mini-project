
import { NextResponse } from 'next/server';
import { AutomationRule } from '@/types';

const mockRules: AutomationRule[] = [
    {
        _id: 'rule-1',
        name: 'Evening Lights On',
        deviceId: '1', // Living Room Light
        action: { type: 'on' },
        trigger: { type: 'time', value: '18:00' }
    },
    {
        _id: 'rule-2',
        name: 'Morning Fan Off',
        deviceId: '2', // Bedroom Fan
        action: { type: 'off' },
        trigger: { type: 'time', value: '09:00' }
    }
];

export async function GET() {
    const response = NextResponse.json(mockRules);
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
    return response;
}

export async function POST(request: Request) {
    const newRuleData = await request.json();
    const newRule: AutomationRule = {
        _id: `rule-${Date.now()}`,
        ...newRuleData
    };
    mockRules.push(newRule);
    return NextResponse.json(newRule, { status: 201 });
}

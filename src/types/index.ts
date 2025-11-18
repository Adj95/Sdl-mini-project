export type User = {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
};

export type Device = {
  _id: string;
  name: string;
  type: 'light' | 'fan' | 'ac' | 'door';
  room: string; // Room ID
  status: {
    isOn?: boolean;
    speed?: number; // for fan
    temperature?: number; // for AC
    isOpen?: boolean; // for door
  };
  powerRating: number; // in watts
};

export type Room = {
  _id: string;
  name:string;
}

export type AutomationRule = {
  _id: string;
  name: string;
  deviceId: string;
  action: {
    type: 'on' | 'off' | 'setValue';
    value?: number;
  };
  trigger: {
    type: 'time';
    value: string; // e.g., '18:00'
  };
};

export type ActivityLog = {
  _id: string;
  device: {
    _id: string;
    name: string;
  };
  action: string;
  triggeredBy: {
    type: 'user' | 'automation';
    id: string;
    name: string;
  };
  timestamp: string;
};

export type EnergyData = {
    totalEnergyUsedToday: number; // in kWh
    estimatedBill: number;
    kwhPerDevice: {
        [deviceId: string]: number;
    };
    devices: Device[]; // Includes all devices with their power ratings
};

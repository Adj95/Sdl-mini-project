import { MongoClient } from 'mongodb';
import { User } from './models/user';
import { Device } from './models/device';
import { AutomationRule } from './models/rule';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sdl-mini-project';

async function seed() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  // Users
  const users: User[] = [
    { name: 'Alice', email: 'alice@example.com', password: 'password123', role: 'admin' },
    { name: 'Bob', email: 'bob@example.com', password: 'password456', role: 'user' },
  ];
  await db.collection('users').deleteMany({});
  await db.collection('users').insertMany(users);

  // Devices
  const devices: Device[] = [
    { name: 'Living Room Light', type: 'light', status: { isOn: true }, powerRating: 60 },
    { name: 'Bedroom Fan', type: 'fan', status: { isOn: false, speed: 50 }, powerRating: 75 },
    { name: 'Kitchen AC', type: 'ac', status: { isOn: true, temperature: 22 }, powerRating: 1500 },
  ];
  await db.collection('devices').deleteMany({});
  await db.collection('devices').insertMany(devices);

  // Rules
  const rules: AutomationRule[] = [
    { name: 'Evening Lights On', condition: '18:00', action: 'Turn on lights', enabled: true },
    { name: 'Morning Fan Off', condition: '09:00', action: 'Turn off fan', enabled: true },
  ];
  await db.collection('rules').deleteMany({});
  await db.collection('rules').insertMany(rules);

  await client.close();
  console.log('Database seeded!');
}

seed().catch(console.error);

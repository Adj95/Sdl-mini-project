const { MongoClient } = require('mongodb');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sdl-mini-project';

async function seed() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  // Users (passwords hashed)
  const users = [
    { name: 'Alice', email: 'alice@example.com', password: await bcrypt.hash('password123', 10), role: 'admin' },
    { name: 'Bob', email: 'bob@example.com', password: await bcrypt.hash('password456', 10), role: 'user' },
  ];
  await db.collection('users').deleteMany({});
  await db.collection('users').insertMany(users);

  // Devices
  const devices = [
    { name: 'Living Room Light', type: 'light', status: { isOn: true }, powerRating: 60 },
    { name: 'Bedroom Fan', type: 'fan', status: { isOn: false, speed: 50 }, powerRating: 75 },
    { name: 'Kitchen AC', type: 'ac', status: { isOn: true, temperature: 22 }, powerRating: 1500 },
  ];
  await db.collection('devices').deleteMany({});
  await db.collection('devices').insertMany(devices);

  // Rules (structure matches frontend expectations)
  const rules = [
    {
      name: 'Evening Lights On',
      trigger: { type: 'time', value: '18:00' },
      action: { type: 'on', value: true },
      deviceId: devices[0]._id,
      enabled: true
    },
    {
      name: 'Morning Fan Off',
      trigger: { type: 'time', value: '09:00' },
      action: { type: 'off', value: false },
      deviceId: devices[1]._id,
      enabled: true
    }
  ];
  await db.collection('rules').deleteMany({});
  await db.collection('rules').insertMany(rules);

  await client.close();
  console.log('Database seeded!');
}

seed().catch(console.error);

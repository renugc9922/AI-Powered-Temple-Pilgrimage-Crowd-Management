
import React from 'react';
import { UserRole } from './types';

export const LOCATIONS = [
  { id: 'gate-a', name: 'Main Entrance (Gate A)', x: 20, y: 50 },
  { id: 'inner-sanctum', name: 'Inner Sanctum', x: 50, y: 50 },
  { id: 'gate-b', name: 'North Exit (Gate B)', x: 80, y: 20 },
  { id: 'bhoga-hall', name: 'Prasad Hall', x: 70, y: 70 },
  { id: 'waiting-area', name: 'Queue Waiting Area', x: 35, y: 30 },
];

export const MEDICAL_TENTS = [
  { id: 'med-1', name: 'Main Medical Center (Sector 1)', lat: 25.4484, lng: 81.8845 },
  { id: 'med-2', name: 'Emergency Post (Sector 4)', lat: 25.4461, lng: 81.8801 },
  { id: 'med-3', name: 'Red Cross Tent (Gate B)', lat: 25.4510, lng: 81.8890 },
];

export const MOCK_USER = {
  name: 'Rajesh Kumar',
  role: UserRole.PILGRIM,
  booking: {
    id: 'BK-9921',
    timeSlot: '14:00 - 15:00',
    status: 'Confirmed',
    queuePosition: 452,
    estimatedWaitMinutes: 45
  }
};

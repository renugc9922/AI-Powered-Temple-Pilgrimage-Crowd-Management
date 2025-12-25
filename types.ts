
export enum UserRole {
  PILGRIM = 'PILGRIM',
  ADMIN = 'ADMIN',
  SECURITY = 'SECURITY',
  MEDICAL = 'MEDICAL'
}

export interface CrowdData {
  location: string;
  count: number;
  capacity: number;
  densityLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Normal' | 'Congested' | 'Panic';
  timestamp: string;
}

export interface Alert {
  id: string;
  type: 'Crowd' | 'Medical' | 'Security';
  severity: 'Info' | 'Warning' | 'Emergency';
  message: string;
  location: string;
  timestamp: string;
  resolved: boolean;
}

export interface DarshanBooking {
  id: string;
  timeSlot: string;
  status: 'Confirmed' | 'Completed' | 'Delayed';
  queuePosition: number;
  estimatedWaitMinutes: number;
}

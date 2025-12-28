
export enum UserRole {
  PILGRIM = 'PILGRIM',
  ADMIN = 'ADMIN',
  SECURITY = 'SECURITY',
  MEDICAL = 'MEDICAL'
}

export enum LoginMethod {
  AADHAR = 'AADHAR',
  PAN = 'PAN',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL'
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
  type: 'Crowd' | 'Medical' | 'Security' | 'Emergency';
  severity: 'Info' | 'Warning' | 'Emergency' | 'Critical';
  message: string;
  location: string;
  timestamp: string;
  resolved: boolean;
  lat?: number;
  lng?: number;
}

export interface DarshanBooking {
  id: string;
  timeSlot: string;
  status: 'Confirmed' | 'Completed' | 'Delayed';
  queuePosition: number;
  estimatedWaitMinutes: number;
}

// FIX: Declare aistudio as a global variable within the global namespace.
// Using 'var' in 'declare global' is the standard way to extend the global scope in modules
// and avoids "identical modifiers" errors that can occur when extending the Window interface directly.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  var aistudio: AIStudio;
}

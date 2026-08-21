export type ViewMode = 
  | 'professor-dashboard'
  | 'active-sessions'
  | 'attendance-reports'
  | 'student-view'
  | 'settings';

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  avatar: string;
  major: string;
  year: string;
  attendanceRate: number; // e.g. 94%
  deviceFingerprint: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  hall: string;
  totalStudents: number;
  schedule: string;
  color: string;
  latitude: number;
  longitude: number;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  studentAvatar: string;
  courseCode: string;
  courseName: string;
  timestamp: string;
  date: string;
  status: 'present' | 'late' | 'absent' | 'excused' | 'geo-flagged';
  distanceFromDesk: number; // in meters
  deviceVerified: boolean;
  notes?: string;
  ipAddress?: string;
}

export interface ActiveSession {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  hall: string;
  startTime: string;
  status: 'active' | 'paused' | 'ended';
  geofenceRadius: number; // in meters (default 100)
  centerLatitude: number;
  centerLongitude: number;
  refreshInterval: number; // in seconds (e.g. 7s)
  currentQrToken: string;
  totalEnrolled: number;
  presentCount: number;
  lateCount: number;
}

export interface SystemSettings {
  defaultGeofenceRadius: number;
  qrRotationInterval: number; // seconds
  allowLateWindowMinutes: number;
  antiProxyStrictDeviceCheck: boolean;
  biometricOptional: boolean;
  campusName: string;
  defaultBuilding: string;
  centerCoordinates: {
    lat: number;
    lng: number;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
}

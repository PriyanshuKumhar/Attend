import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  UserRole,
  ViewMode, 
  Course, 
  Student, 
  AttendanceRecord, 
  ActiveSession, 
  SystemSettings, 
  NotificationItem 
} from '../types';
import { 
  INITIAL_COURSES, 
  INITIAL_STUDENTS, 
  INITIAL_ATTENDANCE_RECORDS, 
  INITIAL_ACTIVE_SESSION, 
  INITIAL_SETTINGS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  courses: Course[];
  students: Student[];
  records: AttendanceRecord[];
  activeSession: ActiveSession | null;
  settings: SystemSettings;
  notifications: NotificationItem[];
  
  // Dynamic QR code state
  qrToken: string;
  qrCountdown: number; // 0 to 100 percentage remaining
  qrSecondsLeft: number;
  isQrPaused: boolean;
  toggleQrPause: () => void;
  
  // Student simulation controls
  currentStudent: Student;
  setCurrentStudent: (student: Student) => void;
  simulatedDistance: number; // in meters (e.g. 14.5m)
  setSimulatedDistance: (dist: number) => void;
  isSimulatorOpen: boolean;
  setIsSimulatorOpen: (open: boolean) => void;
  
  // Actions
  markStudentAttendance: (courseId?: string, overrideDistance?: number) => { success: boolean; message: string; record?: AttendanceRecord };
  updateRecordStatus: (recordId: string, newStatus: AttendanceRecord['status'], note?: string) => void;
  startNewSession: (courseId: string, geofenceRadius?: number, refreshInterval?: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  markNotificationsAsRead: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'read' | 'time'>) => void;
  isProjectorMode: boolean;
  setIsProjectorMode: (val: boolean) => void;
  
  // Auth & Role Switcher Modal
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  targetRoleForAuth: UserRole | null;
  requestRoleSwitch: (role: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('student'); // starts in student mode
  const [currentView, setCurrentView] = useState<ViewMode>('student-scan');
  const [courses] = useState<Course[]>(INITIAL_COURSES);
  const [students] = useState<Student[]>(INITIAL_STUDENTS);
  const [records, setRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE_RECORDS);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(INITIAL_ACTIVE_SESSION);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  
  const [currentStudent, setCurrentStudent] = useState<Student>(INITIAL_STUDENTS[0]); // Alex Rivera
  const [simulatedDistance, setSimulatedDistance] = useState<number>(14.5); // Default 14.5m inside geofence
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  
  const [qrToken, setQrToken] = useState<string>('QR-ATT-CS401-9921-TOKEN-X74');
  const [qrSecondsLeft, setQrSecondsLeft] = useState<number>(settings.qrRotationInterval);
  const [qrCountdown, setQrCountdown] = useState<number>(100);
  const [isQrPaused, setIsQrPaused] = useState<boolean>(false);
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [targetRoleForAuth, setTargetRoleForAuth] = useState<UserRole | null>(null);

  // Generate dynamic cryptographic QR token
  const generateNewQrToken = useCallback((courseCode: string = 'CS401') => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const token = `QR-${courseCode}-${timestamp}-${randomHex}`;
    setQrToken(token);
  }, []);

  // Timer loop for rotating QR Code
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'active' || isQrPaused) return;

    const intervalSec = activeSession.refreshInterval || settings.qrRotationInterval || 7;
    const tickMs = 100;
    let elapsedMs = 0;

    const timer = setInterval(() => {
      elapsedMs += tickMs;
      const totalMs = intervalSec * 1000;
      const remainingMs = Math.max(0, totalMs - elapsedMs);
      
      setQrCountdown((remainingMs / totalMs) * 100);
      setQrSecondsLeft(Math.ceil(remainingMs / 1000));

      if (elapsedMs >= totalMs) {
        elapsedMs = 0;
        generateNewQrToken(activeSession.courseCode);
      }
    }, tickMs);

    return () => clearInterval(timer);
  }, [activeSession, isQrPaused, settings.qrRotationInterval, generateNewQrToken]);

  const toggleQrPause = () => {
    setIsQrPaused(prev => !prev);
  };

  const requestRoleSwitch = (role: UserRole) => {
    if (role === userRole) return;
    if (role === 'professor') {
      // Require faculty verification modal
      setTargetRoleForAuth('professor');
      setIsAuthModalOpen(true);
    } else {
      // Switch to student seamlessly
      setUserRole('student');
      setCurrentView('student-scan');
    }
  };

  const markStudentAttendance = (courseId?: string, overrideDistance?: number) => {
    const targetSession = activeSession;
    const distance = overrideDistance !== undefined ? overrideDistance : simulatedDistance;
    const maxRadius = targetSession?.geofenceRadius || settings.defaultGeofenceRadius;

    // Check if student already checked in for today
    const alreadyLogged = records.some(
      r => r.sessionId === targetSession?.id && r.studentId === currentStudent.id && r.status === 'present'
    );

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const isOutOfGeofence = distance > maxRadius;

    let status: AttendanceRecord['status'] = 'present';
    let notes = `GPS verified at ${distance.toFixed(1)}m from podium`;

    if (isOutOfGeofence) {
      status = 'geo-flagged';
      notes = `Geofence violation: ${distance.toFixed(1)}m exceeds ${maxRadius}m radius limit`;
    }

    const newRecord: AttendanceRecord = {
      id: `rec-${Date.now()}`,
      sessionId: targetSession ? targetSession.id : 'sess-manual',
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentCode: currentStudent.studentId,
      studentAvatar: currentStudent.avatar,
      courseCode: targetSession ? targetSession.courseCode : 'CS401',
      courseName: targetSession ? targetSession.courseName : 'CS401: Algorithms',
      timestamp: timeStr,
      date: 'Today',
      status: status,
      distanceFromDesk: distance,
      deviceVerified: !isOutOfGeofence,
      notes: notes,
      ipAddress: isOutOfGeofence ? 'Cellular / External Proxy' : '192.168.10.144 (Campus WiFi)'
    };

    // Prepend record
    setRecords(prev => [newRecord, ...prev]);

    if (targetSession && status === 'present') {
      setActiveSession(prev => prev ? {
        ...prev,
        presentCount: prev.presentCount + (alreadyLogged ? 0 : 1)
      } : null);
    }

    if (isOutOfGeofence) {
      addNotification({
        title: 'Geofence Warning',
        message: `${currentStudent.name} scanned from ${distance.toFixed(0)}m away (Outside ${maxRadius}m boundary).`,
        type: 'warning'
      });
      return { 
        success: false, 
        message: `Location verification failed: You are ${distance.toFixed(0)}m away (Maximum allowed is ${maxRadius}m).`, 
        record: newRecord 
      };
    }

    return { 
      success: true, 
      message: 'Attendance successfully logged & cryptographically verified!', 
      record: newRecord 
    };
  };

  const updateRecordStatus = (recordId: string, newStatus: AttendanceRecord['status'], note?: string) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        return {
          ...rec,
          status: newStatus,
          notes: note !== undefined ? note : rec.notes
        };
      }
      return rec;
    }));
  };

  const startNewSession = (courseId: string, geofenceRadius: number = 100, refreshInterval: number = 7) => {
    const course = courses.find(c => c.id === courseId) || courses[0];
    const newSession: ActiveSession = {
      id: `sess-${Date.now()}`,
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      instructor: course.instructor,
      hall: course.hall,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'active',
      geofenceRadius: geofenceRadius,
      centerLatitude: course.latitude,
      centerLongitude: course.longitude,
      refreshInterval: refreshInterval,
      currentQrToken: `QR-${course.code}-${Date.now().toString(36).toUpperCase()}`,
      totalEnrolled: course.totalStudents,
      presentCount: 1,
      lateCount: 0,
    };

    setActiveSession(newSession);
    setCurrentView('active-sessions');
    addNotification({
      title: 'New Session Started',
      message: `Live attendance session initiated for ${course.name}.`,
      type: 'info'
    });
  };

  const pauseSession = () => {
    if (!activeSession) return;
    setActiveSession(prev => prev ? { ...prev, status: 'paused' } : null);
    setIsQrPaused(true);
  };

  const resumeSession = () => {
    if (!activeSession) return;
    setActiveSession(prev => prev ? { ...prev, status: 'active' } : null);
    setIsQrPaused(false);
  };

  const endSession = () => {
    if (!activeSession) return;
    setActiveSession(prev => prev ? { ...prev, status: 'ended' } : null);
    addNotification({
      title: 'Session Concluded',
      message: `${activeSession.courseName} attendance session finalized.`,
      type: 'success'
    });
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'read' | 'time'>) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      ...item,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        currentView,
        setCurrentView,
        courses,
        students,
        records,
        activeSession,
        settings,
        notifications,
        qrToken,
        qrCountdown,
        qrSecondsLeft,
        isQrPaused,
        toggleQrPause,
        currentStudent,
        setCurrentStudent,
        simulatedDistance,
        setSimulatedDistance,
        isSimulatorOpen,
        setIsSimulatorOpen,
        markStudentAttendance,
        updateRecordStatus,
        startNewSession,
        pauseSession,
        resumeSession,
        endSession,
        updateSettings,
        markNotificationsAsRead,
        addNotification,
        isProjectorMode,
        setIsProjectorMode,
        isAuthModalOpen,
        setIsAuthModalOpen,
        targetRoleForAuth,
        requestRoleSwitch
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

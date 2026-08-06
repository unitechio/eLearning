export type EventType = 
  | 'meeting' 
  | 'class' 
  | 'exam' 
  | 'reminder' 
  | 'holiday' 
  | 'cancelled'
  | 'interview'
  | 'lesson'
  | 'task'
  | 'blocked'
  | 'travel'
  | 'pending'
  | 'completed';

export type SkillType = 'listening' | 'reading' | 'writing' | 'speaking' | 'general';

export interface AuditTrail {
  readonly createdBy: string;
  readonly createdAt: string;
  readonly lastModifiedBy?: string;
  readonly lastModifiedAt?: string;
}

export interface StudentAttendance {
  readonly id: string;
  readonly name: string;
  readonly status: 'present' | 'absent' | 'unmarked';
}

export interface CalendarEvent {
  readonly id: string;
  readonly title: string;
  readonly date: string; // YYYY-MM-DD
  readonly time: string; // e.g. "9:00 - 9:30 AM"
  readonly col: number;  // 1 = Mon ... 5 = Fri
  readonly rowStart: string; // "9:00 AM" or "09:00"
  readonly rowEnd: string;   // "9:30 AM" or "09:30"
  readonly color: 'blue' | 'orange' | 'purple' | 'gray' | 'green' | 'red';
  readonly type: EventType;
  readonly platform?: string;
  readonly avatars: readonly string[];
  
  // IELTS center specifics
  readonly teacherId: string;
  readonly classroomId: string;
  readonly courseId: string;
  readonly skill: SkillType;
  readonly students: readonly StudentAttendance[];
  readonly maxCapacity: number;
  readonly auditLog: AuditTrail;
}

export interface DayConfig {
  readonly key: string;
  readonly label: string;
  readonly date: string;
}

export interface Teacher {
  readonly id: string;
  readonly name: string;
  readonly skills: readonly SkillType[];
  readonly color: string;
}

export interface Classroom {
  readonly id: string;
  readonly name: string;
  readonly capacity: number;
  readonly color: string;
}

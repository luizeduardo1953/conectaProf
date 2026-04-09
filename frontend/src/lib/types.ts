export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt?: string;
}

export interface Availability {
  id: string;
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Teacher {
  id: string;
  userId: string;
  biography?: string;
  training?: string;
  priceHour?: number;
  telephone?: string;
  user?: User;
  availabilities?: Availability[];
}

export interface Discipline {
  id: string;
  name: string;
}

export interface Scheduling {
  id: string;
  teacherId: string;
  studentId: string;
  disciplineId: string;
  dateHourStart: string;
  dateHourEnd: string;
  observation?: string;
  createdAt?: string;
  teacher?: Teacher;
  student?: User;
  discipline?: Discipline;
}

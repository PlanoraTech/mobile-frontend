export interface DropdownData {
    id: string;
    name: string;
    access?: string;
}

export interface Institution {
    id: string;
    name: string;
    access: string;
    website: string;
    color: string;
}

export interface InstitutionData {
    institution: Institution | null;
    timetables: DropdownData[];
    presentators: DropdownData[];
    rooms: DropdownData[];
}

export interface LoadingState {
    institution: boolean;
    timetables: boolean;
    presentators: boolean;
    rooms: boolean;
}

export enum DayOfWeek {
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday'
  }
  
  export interface Subject {
    id: string;
    name: string;
  }
  
  export interface Presentator {
    id: string;
    name: string;
  }
  
  export interface Room {
    id: string;
    name: string;
  }
  
  export interface Appointment {
    id: string;
    subject: Subject;
    presentators: Presentator[];
    rooms: Room[];
    dayOfWeek: DayOfWeek;
    start: string;
    end: string;
    isCancelled: boolean;
  }

  
export interface UseTimetableProps {
  inst: string | string[];
  selectedView: string | null;
  selectedId: string | null;
}
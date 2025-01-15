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
    groups: DropdownData[];
    presentators: DropdownData[];
    rooms: DropdownData[];
}

export interface LoadingState {
    institution: boolean;
    timetables: boolean;
    groups: boolean;
    presentators: boolean;
    rooms: boolean;
}

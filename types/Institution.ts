export interface Institution {
    id: string,
    name: string,
    timetables: {name: string, id: string}[],
}

export interface Timetable {
    id: string,
    name: string,
}
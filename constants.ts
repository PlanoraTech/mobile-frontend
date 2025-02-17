import { Dimensions } from "react-native";

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
export const DAY_TRANSLATIONS: Record<string, string> = {
  'MONDAY': 'Hétfő',
  'TUESDAY': 'Kedd',
  'WEDNESDAY': 'Szerda',
  'THURSDAY': 'Csütörtök',
  'FRIDAY': 'Péntek'
};

export const TITLE_TRANSLATIONS: Record<string, string> = {
  'timetable': 'Órarend',
  'rooms': 'Terem',
  'presentators': 'Oktató',
};

export const ROLE_TRANSLATIONS: Record<string, string> = {
  'PRESENTATOR': 'Előadó',
  'USER': 'Felhasználó',
};
export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday'
}


export const BASE_URL = 'http://192.168.11.49:3000/institutions';
export const BASE_URL_AUTH = 'http://192.168.11.49:3000';

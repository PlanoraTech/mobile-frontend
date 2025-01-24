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

export const BASE_URL = 'http://192.168.27.1:3000/institutions';
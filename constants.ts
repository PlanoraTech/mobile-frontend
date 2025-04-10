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
  'DIRECTOR': 'Igazgató',
  'PRESENTATOR': 'Előadó',
  'USER': 'Felhasználó',
  'GUEST': 'Vendég',
};
export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday'
}

export const BASE_URL = 'https://planora-dfce142fac4b.herokuapp.com/institutions';
export const BASE_URL_AUTH = 'https://planora-dfce142fac4b.herokuapp.com';
//export const BASE_URL = 'http://192.168.61.222:3000/institutions';
//export const BASE_URL_AUTH = 'http://192.168.61.222:3000';

export const TAB_TYPES = {
  TIMETABLE: 0,
  PRESENTATOR: 1,
  ROOM: 2,
};

export const TAB_CONFIG = [
  {
    value: '0',
    label: 'Órarend',
    accessibilityLabel: 'Órarend',
    icon: 'calendar',
    type: 'timetables',
    placeholder: 'Válassz órarendet',
    searchPlaceholder: 'Órarend keresése...',
    loadingKey: 'timetable',
    dataKey: 'timetables',
  },
  {
    value: '1',
    label: 'Előadó',
    accessibilityLabel: 'Előadó',
    icon: 'account',
    type: 'presentators',
    placeholder: 'Válassz előadót',
    searchPlaceholder: 'Előadó keresése...',
    loadingKey: 'presentators',
    dataKey: 'presentators',
  },
  {
    value: '2',
    label: 'Terem',
    accessibilityLabel: 'Terem',
    icon: 'home',
    type: 'rooms',
    placeholder: 'Válassz termet',
    searchPlaceholder: 'Terem keresése...',
    loadingKey: 'rooms',
    dataKey: 'rooms',
  },
];


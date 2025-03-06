import { LocaleConfig } from "react-native-calendars";

configHungarian();

export function configHungarian() {
    LocaleConfig.locales['hu'] = {
        monthNames: [
            'január',
            'február',
            'március',
            'április',
            'május',
            'június',
            'július',
            'augusztus',
            'szeptember',
            'október',
            'november',
            'december'
        ],
        monthNamesShort: ['jan.', 'febr.', 'márc.', 'ápr.', 'máj.', 'jún.', 'júl.', 'aug.', 'szept.', 'okt.', 'nov.', 'dec.'],
        dayNames: ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'],
        dayNamesShort: ['v', 'h', 'k', 'sze', 'cs', 'p', 'szo'],
        today: "ma"
    };
    LocaleConfig.defaultLocale = 'hu';
}

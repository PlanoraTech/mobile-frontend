import { isSameDayUTC, getCurrentWeekDates, formatWeekRange, formatTime } from '@/utils/dateUtils';
import { validateEmail, validatePassword } from '@/utils/validation';

describe('Utils', () => {
    describe('date utils', () => {

        test('isSameDayUTC', () => {
            const date1 = new Date('2024-01-01');
            const date2 = new Date('2024-01-01');
            expect(isSameDayUTC(date1, date2)).toBe(true);
        });
        test('getCurrentWeekDates', () => {
            const currentDate = new Date('2024-01-01');
            const dates = getCurrentWeekDates(currentDate);
            expect(dates.length).toBe(7);
        });
        test('formatWeekRange', () => {
            const date = new Date('2024-01-01');
            const range = formatWeekRange(date);
            expect(range).toBe('2024. 01. 01. - 2024. 01. 07.');
        });
        test('formatTime', () => {
            const dateString = '2024-01-01T00:00:00';
            const time = formatTime(dateString);
            expect(time).toBe('00:00');
        });

    });

    describe('validation utils', () => {
        test('validateEmail', () => {
            expect(validateEmail('test@test.com')).toBe(true);
        });
        test('validatePassword', () => {
            expect(validatePassword('StrongPassword123!')).toBe(true);
        });
        test('validateEmail', () => {
            expect(validateEmail('invalid-email')).toBe(false);
        });
        test('validatePassword', () => {
            expect(validatePassword('short')).toBe(false);
        });
    });
});

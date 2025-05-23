import { format } from "date-fns";
import { hu } from "date-fns/locale";

export const isSameDayUTC = (date1: Date, date2: Date) => {
    return (
        date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth() &&
        date1.getUTCDate() === date2.getUTCDate()
    );
};

export const getCurrentWeekDates = (currentDate: Date) => {
    const dates = [];
    const monday = new Date(currentDate);

    monday.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        dates.push(date);
    }
    return dates;
};

export const getCurrentDayIndex = () => {
    const date = new Date();
    const currentDay = date.getDay();
    return currentDay > 4 ? 0 : currentDay
}
export const formatWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `${start.toLocaleDateString('hu-HU')} - ${end.toLocaleDateString('hu-HU')}`;
};

export const formatDate = (date: Date) => {
    return date.toLocaleDateString('hu-HU');
};

export const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('hu-HU', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatTimeRange = (start: string, end: string) => {
    return `${formatTime(start)} - ${formatTime(end)}`;
};

export const formatDisplayDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'yyyy MMM dd', { locale: hu });
};
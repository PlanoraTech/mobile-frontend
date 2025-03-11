import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from "react-native";
import { Button, Modal, Portal, Text, useTheme } from "react-native-paper";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, useSharedValue } from "react-native-reanimated";
import { Calendar } from 'react-native-calendars';
import { configHungarian } from '@/utils/calendarLangConfig';
import { BASE_URL } from "@/constants";
import { StatusMessage } from "./StatusMessage";
import ViewToggle from "./ViewToggle";
import { formatDisplayDate } from '@/utils/dateUtils';


interface Props {
    visible: boolean;
    onDismiss: () => void;
}

configHungarian();

const AbsentModal = ({ visible, onDismiss }: Props) => {
    const theme = useTheme();
    const today = new Date();
    const currentYear = today.getFullYear();
    const nextYear = currentYear + 1;
    const minDate = `${currentYear}-01-01`;
    const maxDate = `${nextYear}-12-31`;
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [isAbsentChosen, setIsAbsentChosen] = useState(true);
    const [absences, setAbsences] = useState<{ [date: string]: any }>({});
    const [currentFetched, setCurrentFetched] = useState<boolean>(false);

    const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
    useEffect(() => {

        const selectedColor = theme.colors.primary;

        setAbsences({
            ...getDateRange("2025-02-11", "2025-02-15", selectedColor),
            ...getDateRange("2025-03-20", "2025-03-22", selectedColor),
            ...getDateRange("2025-04-05", "2025-04-10", selectedColor),
            ...getDateRange("2025-05-15", "2025-05-16", selectedColor),
            ...getDateRange("2025-06-01", "2025-06-07", selectedColor),
            ...getDateRange("2025-07-01", "2025-07-01", selectedColor)
        });

    }, [visible]);


    const fetchAbsences = async () => {
        setCurrentFetched(true);
        try {
            setError(null);
            const response = await fetch(`${BASE_URL}/absences/current`);
            if (!response.ok) {
                throw new Error('Hiba történt a hiányzások lekérése során.');
            }
            const data = await response.json();
            setAbsences(data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    visible && !currentFetched && fetchAbsences();

    const getDateRange = (firstDate: string, secondDate: string, selectionColor: string) => {
        const range: { [date: string]: any } = {};
        const start = new Date(firstDate);
        const end = new Date(secondDate);
        const chronologicalStartDate = start <= end ? firstDate : secondDate;
        const chronologicalEndDate = start <= end ? secondDate : firstDate;
        range[chronologicalStartDate] = {
            selected: true,
            color: selectionColor,
            startingDay: true,
            textColor: 'white'
        };

        const currentDate = new Date(chronologicalStartDate);
        currentDate.setDate(currentDate.getDate() + 1);

        while (currentDate < new Date(chronologicalEndDate)) {
            const dateString = currentDate.toISOString().split('T')[0];
            range[dateString] = {
                selected: true,
                color: selectionColor,
                textColor: 'white'
            };
            currentDate.setDate(currentDate.getDate() + 1);
        }

        range[chronologicalEndDate] = {
            selected: true,
            color: selectionColor,
            startingDay: firstDate === secondDate,
            endingDay: true,
            textColor: 'white'
        };

        return range;
    };

    const handleDayPress = useCallback((day: { dateString: string }) => {
        const dateString = day.dateString;
        if (!startDate || (startDate && endDate)) {
            setStartDate(dateString);
            setEndDate(null);

            setMarkedDates({
                [dateString]: {
                    selected: true,
                    color: theme.colors.primary,
                    startingDay: true,
                    endingDay: true,
                    textColor: 'white'
                }
            });
        } else {
            if (startDate > dateString) {
                setStartDate(dateString);
                setEndDate(startDate);
            } else {
                setEndDate(dateString);
            }
            const selectedColor = isAbsentChosen ? theme.colors.secondary : theme.colors.tertiary;
            setMarkedDates(getDateRange(startDate, dateString, selectedColor));

        }
    }, [startDate, endDate, theme.colors.primary]);

    const handleConfirm = async () => {
        try {
            setError(null);
            setSuccess(null);
            const response = await fetch(
                `${BASE_URL}/absences`,
                { method: 'POST', body: JSON.stringify({ startDate, endDate }) }
            );
            if (!response.ok) {
                throw new Error(isAbsentChosen ? 'Hiba történt a hiányzás bejelentése során.'
                    : 'Hiba történt a jelenlét bejelentése során.');
            }
            setSuccess('Az adatok mentése sikeres volt.');
        } catch (error: any) {
            setError(error.message);
        } finally {
            onClose();
        }
    };

    const onClose = () => {
        onDismiss();
        setMarkedDates({});
        setStartDate(null);
        setEndDate(null);
        setIsAbsentChosen(true);
        setCurrentFetched(false);
    }

    const handleViewChange = () => {
        const nextBoolean = !isAbsentChosen;
        setIsAbsentChosen(nextBoolean);
        const selectedColor = nextBoolean ? theme.colors.secondary : theme.colors.tertiary;
        if (startDate && endDate) {
            setMarkedDates(getDateRange(startDate, endDate, selectedColor));
        }
    }

    return (

        <Portal>
            <Modal
                visible={visible}
                onDismiss={onClose}
                contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
                dismissable={true}
            >
                <ViewToggle
                    leftText='Hiányzás'
                    rightText='Jelenlét'
                    onViewChange={handleViewChange}
                />


                <View style={[styles.dateDisplayContainer, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.dateDisplay}>
                        <Text variant="labelMedium">Kezdő dátum</Text>
                        <Text variant="titleMedium">{formatDisplayDate(startDate)}</Text>
                    </View>

                    <View style={styles.dateDisplay}>
                        <Text variant="labelMedium">Befejező dátum</Text>
                        <Text variant="titleMedium">{formatDisplayDate(endDate)}</Text>
                    </View>
                </View>


                <Calendar
                    minDate={minDate}
                    maxDate={maxDate}
                    horizontal={true}
                    onDayPress={handleDayPress}
                    markedDates={{ ...absences, ...markedDates }}
                    monthFormat="yyyy MMMM"
                    markingType="period"
                    enableSwipeMonths={true}
                    theme={{
                        calendarBackground: theme.colors.surface,
                        textSectionTitleColor: '#b6c1cd',
                        todayTextColor: theme.colors.primary,
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 14,
                        selectedDayBackgroundColor: theme.colors.primary,
                        dotColor: theme.colors.primary,
                        arrowColor: theme.colors.onSurface,
                    }}
                />

                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={onClose}>
                        Mégse
                    </Button>
                    <Button
                        mode="contained"
                        disabled={!startDate || !endDate}
                        onPress={handleConfirm}
                    >
                        Megerősítés
                    </Button>
                </View>
            </Modal>
            {error && <StatusMessage type={"error"} message={error} />}
            {success && <StatusMessage type={"success"} message={success} />}
        </Portal>

    );
};

export default AbsentModal;

const styles = StyleSheet.create({
    modalContainer: {
        padding: 16,
        marginHorizontal: 16,
        borderRadius: 8,
    },
    surface: {
        padding: 16,
        borderRadius: 8,
        elevation: 4,
    },
    resultContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 16,
        padding: 16,
        borderRadius: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
        gap: 8,
    },
    dateDisplayContainer: {
        flexDirection: 'row',
        padding: 8,
        justifyContent: 'space-evenly',
        width: '100%',
    },
    dateDisplay: {
        width: '40%',
        padding: 8,
    },
    dateDisplayDivider: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    toText: {
        color: '#757575',
    }
});
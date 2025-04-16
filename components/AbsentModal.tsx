import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from "react-native";
import { Button, Modal, Portal, Text, useTheme } from "react-native-paper";
import { Calendar } from 'react-native-calendars';
import { configHungarian } from '@/utils/calendarLangConfig';
import { BASE_URL } from "@/constants";
import { StatusMessage } from "./StatusMessage";
import ViewToggle from "./ViewToggle";
import { formatDisplayDate } from '@/utils/dateUtils';
import { useInstitutionId } from '@/contexts/InstitutionIdProvider';
import { useAuth } from '@/contexts/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoadingSpinner } from './LoadingSpinner';
import DropdownComponent from './Dropdown';

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

    const { institutionId } = useInstitutionId();
    const [isAbsentChosen, setIsAbsentChosen] = useState(true);
    const [absences, setAbsences] = useState<{ [date: string]: any }>({});
    const { user } = useAuth();
    const [selectedPresentatorId, setSelectedPresentatorId] = useState<string | null>(null);
    const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
    const [placeholder, setPlaceholder] = useState<string>('Válassz előadót');
    
    const presentatorId = user?.institutions.find((institution) => institution.institutionId === institutionId)?.presentatorId;
    const activePresentatorId = selectedPresentatorId || presentatorId;
    
    // Modified to include selectedPresentatorId in the query key
    const { data, isLoading, error } = useQuery({
        queryKey: ['absences', institutionId, activePresentatorId],
        
        queryFn: async () => {
            // Use the selected presentator ID if available, otherwise use the current user's
            const response = await fetch(`${BASE_URL}/${institutionId}/presentators/${activePresentatorId}/substitutions`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user?.token}`
                },
            });
            if (!response.ok) {
                throw new Error('Hiba történt a hiányzások lekérése során.');
            }
            return response.json();
        },
        enabled: !!visible && !!activePresentatorId,
    });


    useEffect(() => {
        if (data && Array.isArray(data)) {
            const absencesMap: { [date: string]: any } = {};

            data.forEach(absence => {
                if (absence.from && absence.to) {
                    const start = new Date(absence.from);
                    const end = new Date(absence.to);
                    const currentDate = new Date(start);

                    const color = theme.colors.secondary;

                    const startDateString = start.toISOString().split('T')[0];
                    absencesMap[startDateString] = {
                        startingDay: true,
                        color: color,
                        textColor: 'white'
                    };

                    currentDate.setDate(currentDate.getDate() + 1);
                    while (currentDate < end) {
                        const dateString = currentDate.toISOString().split('T')[0];
                        absencesMap[dateString] = {
                            color: color,
                            textColor: 'white'
                        };
                        currentDate.setDate(currentDate.getDate() + 1);
                    }

                    const endDateString = end.toISOString().split('T')[0];
                    absencesMap[endDateString] = {
                        endingDay: true,
                        color: color,
                        textColor: 'white'
                    };

                    if (startDateString === endDateString) {
                        absencesMap[startDateString] = {
                            startingDay: true,
                            endingDay: true,
                            color: color,
                            textColor: 'white'
                        };
                    }
                }
            });

            setAbsences(absencesMap);
        }
    }, [data, theme.colors]);

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
    
    const queryClient = useQueryClient();

    const resetState = () => {
        setMarkedDates({});
        setStartDate(null);
        setEndDate(null);
        setIsAbsentChosen(true);
    }

    const onClose = () => {
        reset();
        onDismiss();
        setMarkedDates({});
        setStartDate(null);
        setEndDate(null);
        setSelectedPresentatorId(null);
        
        queryClient.invalidateQueries({ queryKey: ['absences', institutionId] });
    }

    const { mutate, isPending: isMutationLoading, error: mutationError, isSuccess: mutationSuccess, reset } = useMutation({
        mutationFn: async (variables: { startDate: string, endDate: string, isAbsentChosen: boolean }) => {
            const { startDate, endDate, isAbsentChosen } = variables;
            const response = await fetch(
                `${BASE_URL}/${institutionId}/presentators/${activePresentatorId}/substitute`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`,
                    },
                    method: 'PATCH',
                    body: JSON.stringify({ from: startDate, to: endDate, isSubstituted: isAbsentChosen })
                }
            );
          
            if (!response.ok) {
                if (response.status === 400) throw new Error('Hibás kérés. Ellenőrizd a dátumokat!');
                if (response.status === 404) throw new Error('Az adott időszakban nincsen órád.');
                throw new Error(isAbsentChosen ? 'Hiba történt a hiányzás bejelentése során.'
                    : 'Hiba történt a jelenlét bejelentése során.');
            }
        },
      
        
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timetable'] });
            queryClient.invalidateQueries({ queryKey: ['absences'] });
            resetState(); 
            onDismiss();
        },
        onError: (error) => {
            resetState();
            console.error('Hiba történt:', error);
        },
    });

    const { data: presentators} = useQuery({
        queryKey: ['presentators', institutionId],
        queryFn: async () => {
            const response = await fetch(`${BASE_URL}/${institutionId}/presentators`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user?.token}`
                },
            });
            if (!response.ok) {
                throw new Error('Hiba történt az előadók lekérése során.');
            }
            return response.json();
        },
        enabled: !!visible,
    });


    const handleViewChange = () => {
        const nextBoolean = !isAbsentChosen;
        setIsAbsentChosen(nextBoolean);
        const selectedColor = nextBoolean ? theme.colors.secondary : theme.colors.tertiary;
        if (startDate && endDate) {
            setMarkedDates(getDateRange(startDate, endDate, selectedColor));
        }
    }

    const selectPresentator = (id: string, name: string) => {
        // Reset current selection when changing presentator
        setMarkedDates({});
        setStartDate(null);
        setEndDate(null);
        
        setSelectedPresentatorId(id);
        setPlaceholder(name);
        
        // Invalidate and refetch the absences for the newly selected presentator
        queryClient.invalidateQueries({ queryKey: ['absences', institutionId, id] });
    }

    const handleConfirm = () => {
        if (startDate && endDate) {
            mutate({ startDate, endDate, isAbsentChosen });
        }
    };

    const isDirector = user?.institutions.find(institution => institution.institutionId === institutionId)?.role === 'DIRECTOR'

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onClose}
                contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
                dismissable={true}
            >
                {isLoading || isMutationLoading ? <LoadingSpinner /> :
                    <>
                        {isDirector && <DropdownComponent onSelect={(item) => selectPresentator(item.id, item.name)} placeholder={placeholder} data={presentators} /> }
                        <ViewToggle
                            leftText='Hiányzás'
                            rightText='Jelenlét'
                            onViewChange={handleViewChange} /><View style={[styles.dateDisplayContainer, { backgroundColor: theme.colors.surface }]}>
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
                            }} /><View style={styles.buttonContainer}>
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
                        </View></>

                }
                {mutationError && <StatusMessage type={"error"} message={mutationError.message} />}
            </Modal>
            {error && <StatusMessage type={"error"} message={error.message} />}
            {mutationSuccess && <StatusMessage type={"success"} message={"Az adatok mentése sikeres volt"} />}
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
})
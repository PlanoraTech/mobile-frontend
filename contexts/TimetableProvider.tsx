import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BASE_URL } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthProvider';
import { useInstitutionId } from '@/contexts/InstitutionIdProvider';
import { Appointment } from '@/components/AppointmentCard';
import { useQuery, QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

export type TimetableErrorType =
    | 'FETCH_ERROR'       
    | 'STORAGE_ERROR'     
    | 'INVALID_VIEW'      
    | 'AUTHENTICATION'    
    | 'NETWORK'           
    | 'UNKNOWN';         

export interface TimetableError {
    type: TimetableErrorType;
    message: string;
    timestamp: Date;
    details?: any;
}

export interface SelectedTimetable {
    selectedView: string | null;
    selectedId: string | null;
}

interface TimetableContextType {
    timetable: SelectedTimetable;
    setTimetableSelection: (view: string, id: string) => Promise<void>;
    appointmentsQuery: QueryObserverResult<Appointment[], Error>;
    resetTimetableSelection: () => Promise<void>;
    refetchAppointments: (options?: RefetchOptions) => Promise<QueryObserverResult<Appointment[], Error>>;
    timetableLoading: boolean;
    timetableError: TimetableError | null;
    clearError: () => void;
    setError: (type: TimetableErrorType, message: string, details?: any) => void;
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export const TimetableProvider = ({ children }: { children: ReactNode }) => {
    const [timetable, setTimetable] = useState<SelectedTimetable>({
        selectedView: null,
        selectedId: null
    });

    const [error, setErrorState] = useState<TimetableError | null>(null);

    const { user } = useAuth();
    const { institutionId } = useInstitutionId();

    const setError = (type: TimetableErrorType, message: string, details?: any) => {
        setErrorState({
            type,
            message,
            timestamp: new Date(),
            details
        });
    };

    const clearError = () => {
        setErrorState(null);
    };

    useEffect(() => {
        const loadSavedTimetable = async () => {
            try {
                const savedTimetable = await AsyncStorage.getItem('timetable');
                if (savedTimetable) {
                    const { endpoint, id } = JSON.parse(savedTimetable);
                    setTimetable({
                        selectedView: endpoint,
                        selectedId: id
                    });
                }
            } catch (error) {
                console.error('Failed to load saved timetable:', error);
                setError(
                    'STORAGE_ERROR',
                    'Nem sikerült betölteni a mentett órarendet.',
                    error
                );
            }
        };

        loadSavedTimetable();
    }, []);

    const setTimetableSelection = async (view: string, id: string) => {
        clearError();
        setTimetable({
            selectedView: view,
            selectedId: id
        });

        try {
            await AsyncStorage.setItem('timetable', JSON.stringify({ endpoint: view, id }));
        } catch (error) {
            console.error('Failed to save timetable selection:', error);
            setError(
                'STORAGE_ERROR',
                'Nem sikerült menteni az órarend kiválasztását.',
                error
            );
        }
    };

    const resetTimetableSelection = async () => {
        clearError();

        setTimetable({
            selectedView: null,
            selectedId: null
        });

        try {
            await AsyncStorage.removeItem('timetable');
        } catch (error) {
            console.error('Failed to remove timetable selection:', error);
            setError(
                'STORAGE_ERROR',
                'Nem sikerült törölni az órarend kiválasztását.',
                error
            );
        }
    };

    const fetchTimetable = async (): Promise<Appointment[]> => {
        if (!timetable.selectedView || !timetable.selectedId) {
            return [];
        }



        if (!institutionId) {
            throw new Error('Institution ID is missing.');
        }

        const endpoints = {
            timetables: `/timetables/${timetable.selectedId}/appointments`,
            presentators: `/presentators/${timetable.selectedId}/appointments`,
            rooms: `/rooms/${timetable.selectedId}/appointments`,
        };

        const endpoint = endpoints[timetable.selectedView as keyof typeof endpoints];

        if (!endpoint) {
            const error = new Error(`Invalid view type: ${timetable.selectedView}`);
            setError('INVALID_VIEW', `Érvénytelen nézet típus: ${timetable.selectedView}`, { view: timetable.selectedView });
            throw error;
        }

        try {
            const response = await fetch(`${BASE_URL}/${institutionId}${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (!response.ok) {
                let errorType: TimetableErrorType = 'FETCH_ERROR';
                let errorMessage = 'Hiba az órarend betöltése során.';

                if (response.status === 401 || response.status === 403) {
                    errorType = 'AUTHENTICATION';
                    errorMessage = 'Hitelesítési hiba az órarend lekérésekor.';
                } else if (response.status >= 500) {
                    errorType = 'NETWORK';
                    errorMessage = 'A szerver jelenleg nem elérhető. Próbálja újra később.';
                }

                const errorDetails = { status: response.status, statusText: response.statusText };
                setError(errorType, errorMessage, errorDetails);
                throw new Error(errorMessage);
            }
            const data = await response.json();
            return data;
        } catch (error: any) {
            if (!error!.message.includes('Invalid view type') &&
                !error.message.includes('Hiba az órarend') &&
                !error.message.includes('Hitelesítési hiba') &&
                !error.message.includes('A szerver jelenleg')) {
                setError(
                    'UNKNOWN',
                    'Váratlan hiba történt az órarend betöltése közben.',
                    error
                );
            }
            throw error;
        }
    };

    const appointmentsQuery = useQuery({
        queryKey: ['timetable', timetable.selectedView, timetable.selectedId],
        queryFn: fetchTimetable,
        enabled: !!timetable.selectedView && !!timetable.selectedId && !!institutionId,
    });

    useEffect(() => {
        if (appointmentsQuery.error && !error) {
            const err = appointmentsQuery.error;
            setError('FETCH_ERROR', err.message || 'Hiba az órarend betöltése során.', err);
        }
    }, [appointmentsQuery.error, error]);

    const contextValue: TimetableContextType = {
        timetable,
        setTimetableSelection,
        appointmentsQuery,
        resetTimetableSelection,
        refetchAppointments: appointmentsQuery.refetch,
        timetableLoading: appointmentsQuery.isLoading,
        timetableError: error,
        clearError,
        setError
    };

    return (
        <TimetableContext.Provider value={contextValue}>
            {children}
        </TimetableContext.Provider>
    );
};

export const useTimetable = () => {
    const context = useContext(TimetableContext);

    if (context === undefined) {
        throw new Error('useTimetable must be used within a TimetableProvider');
    }

    return context;
};
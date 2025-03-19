import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BASE_URL } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthProvider';
import { useInstitutionId } from '@/contexts/InstitutionIdProvider';
import { Appointment } from '@/components/AppointmentCard';
import { useQuery, QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

// Define possible error types for better error handling
export type TimetableErrorType =
    | 'FETCH_ERROR'       // Error when fetching appointments
    | 'STORAGE_ERROR'     // Error with AsyncStorage operations
    | 'INVALID_VIEW'      // Invalid view type selected
    | 'AUTHENTICATION'    // Authentication issues
    | 'NETWORK'           // Network connectivity issues
    | 'UNKNOWN';          // Unknown errors

// Define the error object structure
export interface TimetableError {
    type: TimetableErrorType;
    message: string;
    timestamp: Date;
    details?: any;
}

// Define the shape of our timetable context state
export interface SelectedTimetable {
    selectedView: string | null;
    selectedId: string | null;
}

// Define the shape of the context including state and functions
interface TimetableContextType {
    // The current timetable selection state
    timetable: SelectedTimetable;
    // Function to update the timetable selection
    setTimetableSelection: (view: string, id: string) => Promise<void>;
    // Query result with the appointments data
    appointmentsQuery: QueryObserverResult<Appointment[], Error>;
    // Reset the timetable selection to null values
    resetTimetableSelection: () => Promise<void>;
    // Function to refetch appointments data
    refetchAppointments: (options?: RefetchOptions) => Promise<QueryObserverResult<Appointment[], Error>>;
    // Check if we're currently loading appointments
    timetableLoading: boolean;
    // Current error state (null if no error)
    timetableError: TimetableError | null;
    // Function to clear the current error
    clearError: () => void;
    // Function to manually set an error (useful for derived components)
    setError: (type: TimetableErrorType, message: string, details?: any) => void;
}

// Create the context with a meaningful default value
const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

// Provider component that wraps your app and makes the timetable context available
export const TimetableProvider = ({ children }: { children: ReactNode }) => {
    // Internal state to track the selected view and ID
    const [timetable, setTimetable] = useState<SelectedTimetable>({
        selectedView: null,
        selectedId: null
    });

    // Separate error state management
    const [error, setErrorState] = useState<TimetableError | null>(null);

    const { user } = useAuth();
    const { institutionId } = useInstitutionId();

    // Helper function to set errors with consistent structure
    const setError = (type: TimetableErrorType, message: string, details?: any) => {
        setErrorState({
            type,
            message,
            timestamp: new Date(),
            details
        });
    };

    // Function to clear current error
    const clearError = () => {
        setErrorState(null);
    };

    // Effect to load saved timetable on component mount
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

    // Function to update the timetable selection and save to storage
    const setTimetableSelection = async (view: string, id: string) => {
        // Clear any existing errors when changing selection
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

    // Function to reset timetable selection
    const resetTimetableSelection = async () => {
        // Clear any existing errors when resetting
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

    // Function to fetch the timetable data with improved error handling
    const fetchTimetable = async (): Promise<Appointment[]> => {
        if (!timetable.selectedView || !timetable.selectedId) {
            return [];
        }

        if (!user?.token) {
            throw new Error('Authentication token is missing.');
        }

        if (!institutionId) {
            throw new Error('Institution ID is missing.');
        }

        const endpoints = {
            timetable: `/timetables/${timetable.selectedId}/appointments`,
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
                // Handle different HTTP error codes
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
            // Only set error if it's not already been set by other handlers
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

    // Use react-query to manage the data fetching
    const appointmentsQuery = useQuery({
        queryKey: ['timetable', timetable.selectedView, timetable.selectedId],
        queryFn: fetchTimetable,
        enabled: !!timetable.selectedView && !!timetable.selectedId && !!institutionId,
    });

    // Handle query errors separately
    useEffect(() => {
        if (appointmentsQuery.error && !error) {
            const err = appointmentsQuery.error;
            setError('FETCH_ERROR', err.message || 'Hiba az órarend betöltése során.', err);
        }
    }, [appointmentsQuery.error, error]);

    // Create the context value object with all the state and functions
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

    // Provide the timetable context to children components
    return (
        <TimetableContext.Provider value={contextValue}>
            {children}
        </TimetableContext.Provider>
    );
};

// Custom hook to use the timetable context
export const useTimetable = () => {
    const context = useContext(TimetableContext);

    if (context === undefined) {
        throw new Error('useTimetable must be used within a TimetableProvider');
    }

    return context;
};
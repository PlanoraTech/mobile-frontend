import { BASE_URL } from '@/constants';
import { useAuth } from '@/contexts/AuthProvider';
import { DropdownItem } from '@/components/Dropdown';
import { useInstitutionId } from '@/contexts/InstitutionIdProvider';
import { DayEvent } from '@/components/EventCard';
import { useQueries, RefetchOptions } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface InstitutionData {
    id: string;
    name: string;
    timetables: DropdownItem[];
    presentators: DropdownItem[];
    rooms: DropdownItem[];
    events: DayEvent[];
}

const clearSelectedInstitutionId = () => {
    const { setInstitutionId } = useInstitutionId();
    setInstitutionId("");
    AsyncStorage.removeItem('selectedInstitutionId')
        .then(() => console.log('Selected institution ID cleared'))
        .catch(error => console.error('Error clearing selected institution ID:', error));
}

const fetchData = async (endpoint: string, id: string, token: string) => {
    const response = await fetch(`${BASE_URL}/${id}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (response.status === 403) {
        throw new Error(`Nincs jogosultságod az intézmény adatainak lekéréséhez!`);
    }
    if (!response.ok) {
        throw new Error(`Nem sikerült lekérni az intézmény adatait!`);
    }
    return await response.json();
};

export const useInstitutionData = () => {
    const { institutionId } = useInstitutionId();
    const { user } = useAuth();
    const token = user?.token || '';

    const results = useQueries({
        queries: [
            {
                queryKey: ['institution', institutionId],
                queryFn: () => fetchData("", institutionId, token),
                enabled: !!institutionId
            },
            {
                queryKey: ['timetables', institutionId],
                queryFn: () => fetchData("/timetables", institutionId, token),
                enabled: !!institutionId
            },
            {
                queryKey: ['presentators', institutionId],
                queryFn: () => fetchData("/presentators", institutionId, token),
                enabled: !!institutionId
            },
            {
                queryKey: ['rooms', institutionId],
                queryFn: () => fetchData("/rooms", institutionId, token),
                enabled: !!institutionId
            },
            {
                queryKey: ['events', institutionId],
                queryFn: () => fetchData("/events", institutionId, token),
                enabled: !!institutionId,
            },
        ],
    });

    const isLoading = results.some(result => result.isLoading);

    const errors = results.map(result => result.error).filter(Boolean);
    const error = errors.length > 0 ? errors[0] : null;

    error && clearSelectedInstitutionId();

    const [
        institutionResult,
        timetablesResult,
        presentatorsResult,
        roomsResult,
        eventsResult
    ] = results;

    const institution: InstitutionData | null = !isLoading && !error ? {
        id: institutionId,
        name: institutionResult.data?.name || '',
        timetables: timetablesResult.data || [],
        presentators: presentatorsResult.data || [],
        rooms: roomsResult.data || [],
        events: eventsResult.data || []
    } : null;
    return { institution, isLoading, error };
};
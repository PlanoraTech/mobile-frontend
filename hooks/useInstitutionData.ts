import { BASE_URL } from '@/constants';
import { useAuth } from '@/contexts/AuthProvider';
import { DropdownItem } from '@/components/Dropdown';
import { useInstitutionId } from '@/contexts/InstitutionIdProvider';
import { DayEvent } from '@/components/EventModal';
import { useQueries } from '@tanstack/react-query';

export interface InstitutionData {
    id: string;
    name: string;
    timetables: DropdownItem[];
    presentators: DropdownItem[];
    rooms: DropdownItem[];
    events: DayEvent[];
}

const fetchData = async (endpoint: string, id: string, token: string) => {
    console.log("This function is called");
    console.log(`path: ${BASE_URL}/${id}${endpoint}`);
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
                enabled: !!institutionId
            },
        ],
    });

    const isPending = results.some(result => result.isPending) && !!institutionId;

    const errors = results.map(result => result.error).filter(Boolean);
    const error = errors.length > 0 ? errors[0] : null;

    const [
        institutionResult,
        timetablesResult,
        presentatorsResult,
        roomsResult,
        eventsResult
    ] = results;

    const institution: InstitutionData | null = !isPending && !error ? {
        id: institutionId,
        name: institutionResult.data?.name || '',
        timetables: timetablesResult.data || [],
        presentators: presentatorsResult.data || [],
        rooms: roomsResult.data || [],
        events: eventsResult.data || []
    } : null;

    return { institution, isPending, error };
};
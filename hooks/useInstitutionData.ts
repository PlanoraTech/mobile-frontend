
import { BASE_URL } from '@/constants';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { DropdownItem } from '@/components/Dropdown';
import { useInstitutionId } from '@/contexts/InstitutionIdProvider';


export interface InstitutionData {
    institution: DropdownItem | null;
    timetables: DropdownItem[];
    presentators: DropdownItem[];
    rooms: DropdownItem[];
}

interface LoadingState {
    institution: boolean;
    timetables: boolean;
    presentators: boolean;
    rooms: boolean;
}

export const useInstitutionData = () => {
    const { user } = useAuth();
    const { institutionId } = useInstitutionId();
    const [data, setData] = useState<InstitutionData>({

        institution: null,
        timetables: [],
        presentators: [],
        rooms: []
    });

    const [loading, setLoading] = useState<LoadingState>({
        institution: false,
        timetables: false,
        presentators: false,
        rooms: false
    });

    const [error, setError] = useState<string | null>(null);

    const fetchData = async (endpoint: string, dataKey: keyof InstitutionData, loadingKey: keyof LoadingState) => {
        try {
            setError(null);
            setLoading(prev => ({ ...prev, [loadingKey]: true }));

            const response = await fetch(`${BASE_URL}/${institutionId}${endpoint}/?token=${user?.token}`);
            if (response.status === 403) {
                throw new Error(`Nincs jogosultságod az intézmény adatainak lekéréséhez!`);
            }
            if (!response.ok) {
                throw new Error(`Nem sikerült lekérni az intézmény adatait!`);
            }
            const result = await response.json();
            setData(prev => ({ ...prev, [dataKey]: result }));

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Valami hiba történt...');
        } finally {
            setLoading(prev => ({ ...prev, [loadingKey]: false }));
        }
    };

    useEffect(() => {
        if (institutionId) {
            Promise.all([
                fetchData('', 'institution', 'institution'),
                fetchData('/timetables', 'timetables', 'timetables'),
                fetchData('/presentators', 'presentators', 'presentators'),
                fetchData('/rooms', 'rooms', 'rooms')
            ]);
        }
    }, [institutionId]);

    return { data, loading, error };
};
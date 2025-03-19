import { BASE_URL } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthProvider';
import { useInstitutionId } from '@/contexts/InstitutionIdProvider';
import { Appointment } from '@/components/AppointmentCard';
import { useQuery } from '@tanstack/react-query';

interface UseTimetableProps {
  selectedView: string | null;
  selectedId: string | null;
}

export interface SelectedTimetable {
  selectedView: string | null;
  selectedId: string | null;
}

export const useTimetable = ({ selectedView, selectedId }: UseTimetableProps) => {
  const { user } = useAuth();
  const { institutionId } = useInstitutionId();

  const saveTimetable = async () => {
    if (selectedId && selectedView) {
      await AsyncStorage.setItem('timetable', JSON.stringify({ id: selectedId, endpoint: selectedView }));
    }
  }
  saveTimetable();

  const fetchTimetable = async (): Promise<Appointment[]> => {
    console.log("Fetching timetable data...");
    console.log(`Selected view: ${selectedView}, Selected ID: ${selectedId}`);
    const endpoints = {
      timetable: `/timetables/${selectedId}/appointments`,
      presentators: `/presentators/${selectedId}/appointments`,
      rooms: `/rooms/${selectedId}/appointments`,
    };

    const endpoint = endpoints[selectedView as keyof typeof endpoints];
    const response = await fetch(`${BASE_URL}/${institutionId}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Hiba az órarend betöltése során.');
    }
    return await response.json();
  };

  return useQuery({
    queryKey: ['timetable', selectedView, selectedId],
    queryFn: fetchTimetable,
    enabled: !!selectedView && !!selectedId
  });

};

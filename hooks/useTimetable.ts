import { useState, useEffect } from 'react';
import { BASE_URL } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthProvider';
import { useInstitutionId } from '@/contexts/InstitutionIdProvider';
import { Appointment } from '@/components/AppointmentCard';




interface UseTimetableProps {
  selectedView: string | null;
  selectedId: string | null;
}


export const useTimetable = ({ selectedView, selectedId }: UseTimetableProps) => {
  const { user } = useAuth();
  const { institutionId } = useInstitutionId();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    fetchTimetable();
    saveTimetable();
  }, [selectedId]);

  const saveTimetable = async () => {
    if (selectedId && selectedView) {
      await AsyncStorage.setItem('timetable', JSON.stringify({ id: selectedId, endpoint: selectedView }));
    }
  }
  const fetchTimetable = async () => {

    if (!selectedView || !selectedId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoints = {
        timetable: `/timetables/${selectedId}/appointments`,
        presentators: `/presentators/${selectedId}/appointments`,
        rooms: `/rooms/${selectedId}/appointments`,
      };

      const endpoint = endpoints[selectedView as keyof typeof endpoints];
      const response = await fetch(`${BASE_URL}/${institutionId}${endpoint}/?token=${user?.token}`);

      if (!response.ok) {
        throw new Error('Hiba az órarend betöltése során.');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error: any) {
      console.error(error.message);
      setError('Hiba az órarend betöltése során. Kérjük próbáld újra később.');
    } finally {
      setLoading(false);
    }
  };

  return { appointments, loading, error };
};

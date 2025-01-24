import { useState, useEffect } from 'react';
import { BASE_URL } from '@/constants';
import { Appointment, UseTimetableProps } from '@/types';

export const useTimetable = ({ inst, selectedView, selectedId }: UseTimetableProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!selectedView || !selectedId) return;
      
      setLoading(true);
      try {
        const endpoints = {
          timetable: `/timetables/${selectedId}/appointments`,
          presentators: `/presentators/${selectedId}/appointments`,
          rooms: `/rooms/${selectedId}/appointments`,
          groups: `/groups/${selectedId}/appointments`
        };
        console.log(`selectedView: ${selectedView}`)
        const endpoint = endpoints[selectedView as keyof typeof endpoints];
        const response = await fetch(`${BASE_URL}/${inst}${endpoint}`);
        console.log(`url: ${BASE_URL}/${inst}${endpoint}`)
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

    fetchTimetable();
  }, [selectedView, selectedId, inst]);

  return { appointments, loading, error };
};

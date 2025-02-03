import { useState, useEffect } from 'react';
import { BASE_URL } from '@/constants';
import { Appointment, DayEvent, UseTimetableProps } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthProvider';

export const useTimetable = ({ inst, selectedView, selectedId }: UseTimetableProps) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [events, setEvents] = useState<DayEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
    fetchTimetable();

    console.log("error: "+error);
    console.log("selectedId: "+selectedId);
    console.log("selectedView: "+selectedView);

    const saveTimetable = async () => {
      if (selectedId && selectedView) {
        await AsyncStorage.setItem('timetable', JSON.stringify({ id: selectedId, endpoint: selectedView }));  
      }
    }
    saveTimetable();

  }, [selectedView, selectedId]);
  const fetchTimetable = async () => {
    
    if (!selectedView || !selectedId) return;
  
    setLoading(true);
    setError(null);

    try {
      const endpoints = {
        timetable: `/timetables/${selectedId}/appointments`,
        presentators: `/presentators/${selectedId}/appointments`,
        rooms: `/rooms/${selectedId}/appointments`,
      };
 
      const endpoint = endpoints[selectedView as keyof typeof endpoints];
      console.log("user token in timetable: "+user?.token);
      const response = await fetch(`${BASE_URL}/${inst}${endpoint}/?token=${user?.token}`);

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

  const fetchEvents = async () => {
    if (!selectedView || !selectedId) return;
    if (selectedView === 'timetable') {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/${inst}/timetables/${selectedId}/?token=${user?.token}`);
        if (!response.ok) {
          throw new Error('Hiba az események betöltése során.');
        }
        const data = await response.json();
        setEvents(data.events);
      } catch (error: any) {
        console.error(error.message);
        setError('Hiba az események betöltése során. Kérjük próbáld újra később.');
      } finally {
        setLoading(false);
      }
    }
  };
  return { appointments, events, loading, error };
};

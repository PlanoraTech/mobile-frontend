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
      console.log("timetableid", selectedId);
      const data = await response.json();
      /*   const appointments = Array.isArray(data) ? data : [data];
  
        // Add the test appointment
        // Generate 30 appointments (6 per day) for the week starting March 10, 2025
        const weekStartDate = new Date('2025-03-10T08:00:00.000Z'); // Monday
        const subjects = [
          { id: "c8fa36b9-ce89-4f71-bb90-f93d789d562d", name: "Frontend fejlesztés", subjectId: "Frontend" },
          { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "Backend fejlesztés", subjectId: "Backend" },
          { id: "b2c3d4e5-f6a7-8901-bcde-f12345678901", name: "Adatbáziskezelés", subjectId: "Database" },
          { id: "c3d4e5f6-a7b8-9012-cdef-123456789012", name: "Matematika", subjectId: "Math" },
          { id: "d4e5f6a7-b8c9-0123-defg-2345678901234", name: "Programozási alapok", subjectId: "Programming" }
        ];
  
        const presentators = [
          { id: "768a3c68-e092-4ec0-bf65-c9dff03a63eb", name: "Rápolthy Bálint", isSubstituted: false },
          { id: "868a3c68-e092-4ec0-bf65-c9dff03a63ec", name: "Kovács János", isSubstituted: false },
          { id: "968a3c68-e092-4ec0-bf65-c9dff03a63ed", name: "Nagy Péter", isSubstituted: false }
        ];
  
        const rooms = [
          { id: "d7b21ada-cb95-4710-a298-4cbb21c26d7f", name: "A118" },
          { id: "e8b21ada-cb95-4710-a298-4cbb21c26d8f", name: "B220" },
          { id: "f9b21ada-cb95-4710-a298-4cbb21c26d9f", name: "C330" }
        ];
  
        const timetables = [
          { id: "0ef2aec4-3cea-44e6-9031-198a77ce4461", name: "13E" }
        ];
  
        // Generate 30 appointments (6 per day for 5 days)
        for (let day = 0; day < 5; day++) { // Monday to Friday
          for (let slot = 0; slot < 10; slot++) { // 6 slots per day
            const startTime = new Date(weekStartDate);
            startTime.setDate(weekStartDate.getDate() + day);
            startTime.setHours(8 + Math.floor(slot * 1.5));
            startTime.setMinutes((slot * 1.5 % 1) * 60);
  
            const endTime = new Date(startTime);
            endTime.setMinutes(endTime.getMinutes() + 75); // 75 min lessons
  
            appointments.push({
              id: `appt-${day}-${slot}-${Math.random().toString(36).substring(2, 10)}`,
              subject: subjects[Math.floor(Math.random() * subjects.length)],
              presentators: [presentators[Math.floor(Math.random() * presentators.length)]],
              rooms: [rooms[Math.floor(Math.random() * rooms.length)]],
              start: startTime.toISOString(),
              end: endTime.toISOString(),
              isCancelled: Math.random() < 0.1, // 10% chance of being cancelled
              timetables: [timetables[0]]
            });
          }
        }
   */



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

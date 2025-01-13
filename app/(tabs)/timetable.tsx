import { useGlobalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

export default function TimetableScreen() {
    const { inst, endpoint, id } = useGlobalSearchParams();
    const [appointments, setAppointments] = useState([]);
    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const response = await fetch(`http://localhost:3000/institutions/${inst}/${endpoint}/${id}/appointments`);
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Hiba az órarend betöltése során:', error);
            }
        }
        if (inst && endpoint && id) {
            fetchTimetable();
        }
    },[id]);
    return (
        <View>
            <Text>Timetable</Text>
        </View>
    );
}
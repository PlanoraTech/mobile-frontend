import { useInstitution } from '@/contexts/InstitutionProvider';
import { useInstitutionData } from '@/hooks/useInstitutionData';
import { MaterialIcons } from '@expo/vector-icons';
import {Tabs} from 'expo-router';

interface GlobalInst {
    id: string;
    name: string;
}
export default function TabLayout() {
    const institutionId = useInstitution().id;
    const {data, loading, error} = useInstitutionData(institutionId);
    return (
        <Tabs>
        <Tabs.Screen name="timetable" options={{
            headerShown: false,
            title: 'Órarend',
            tabBarIcon: ({color, size}) => <MaterialIcons name="schedule" size={size} color={color} />,
        }} />
        <Tabs.Screen name="profile" options={{
            title: 'Profil',
            tabBarIcon: ({color, size}) => <MaterialIcons name="person" size={size} color={color} />,
            }} />
        </Tabs>
    );
    }
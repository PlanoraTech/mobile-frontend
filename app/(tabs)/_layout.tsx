import { useInstitution } from '@/contexts/InstitutionProvider';
import { useInstitutionData } from '@/hooks/useInstitutionData';
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
        <Tabs.Screen name="register" options={{title: 'Regisztráció'}} />

        {institutionId?
         <Tabs.Screen name="index" options={{title: data.institution?.name || 'asd'}} />
        : <Tabs.Screen name="institution" options={{title: 'Intézmény'}} />}
        <Tabs.Screen name="login" options={{title: 'Bejelentkezés'}} />
        <Tabs.Screen name="timetable" options={{headerShown: false}} />
        <Tabs.Screen name="profile" options={{title: 'Profil'}} />
        <Tabs.Screen name="group" options={{title: 'Csoportok'}} />
        </Tabs>
    );
    }
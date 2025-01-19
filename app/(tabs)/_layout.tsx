import { useInstitution } from '@/contexts/InstitutionProvider';
import {Tabs} from 'expo-router';

export default function TabLayout() {
    const institutionIds = useInstitution().ids;
    return (
        <Tabs>
        <Tabs.Screen name="register" options={{title: 'Regisztráció'}} />
        {!institutionIds?
         <Tabs.Screen name="index" options={{title: 'Főoldal'}} />
        : <Tabs.Screen name="institution" options={{title: 'Intézmény'}} />}
        <Tabs.Screen name="login" options={{title: 'Bejelentkezés'}} />
        <Tabs.Screen name="timetable" options={{headerShown: false}} />
        <Tabs.Screen name="group" options={{title: 'Csoportok'}} />
        </Tabs>
    );
    }
import { useInstiturion } from '@/contexts/InstitutionProvider';
import {Tabs} from 'expo-router';

export default function TabLayout() {
    const institutionIds = useInstiturion().ids;
    return (
        <Tabs>
        <Tabs.Screen name="register" options={{title: 'Regisztráció'}} />
        {!institutionIds?
         <Tabs.Screen name="index" options={{title: 'Főoldal'}} />
        : <Tabs.Screen name="institution" options={{title: 'Órarend'}} />}
        <Tabs.Screen name="login" options={{title: 'Bejelentkezés'}} />
        </Tabs>
    );
    }
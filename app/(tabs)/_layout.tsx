import {Tabs} from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs>
        <Tabs.Screen name="register" options={{title: 'Regisztráció'}} />
        <Tabs.Screen name="index" options={{title: 'Főoldal'}} />
        <Tabs.Screen name="login" options={{title: 'Bejelentkezés'}} />
        </Tabs>
    );
    }
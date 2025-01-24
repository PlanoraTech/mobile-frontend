
import { useTheme } from '@/contexts/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    const { theme } = useTheme();
    const bgColor = theme === 'dark' ? '#1a1a1a' : '#FAF9F6';
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            headerTintColor: theme === 'dark' ? '#adadad' : '#333',
        }}>
            <Tabs.Screen name="timetable" options={{
            headerShown: false,
            tabBarStyle: {backgroundColor: bgColor},
            tabBarIcon: ({ color, size }) => <MaterialIcons name="schedule" size={size} color={color} />,
            }} />
            <Tabs.Screen name="profile" options={{
            title: 'Profil',
            headerShown: false,
            tabBarStyle: {backgroundColor: bgColor},
            tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
            }} />
        </Tabs>
    );
}
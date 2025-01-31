import { useTheme } from '@/contexts/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    const { theme } = useTheme();

    return (
        <Tabs 
        screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            headerTintColor: theme === 'dark' ? '#adadad' : '#333',
            tabBarInactiveTintColor: theme === 'dark' ? '#adadad' : '#333',
            tabBarStyle: {
                backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                borderTopWidth: 0,
            },
            headerShown: false,
        }}
        
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Órarend',
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="schedule" size={size} color={color} />,

                    animation: 'shift'
                }}
                
            
            />
            <Tabs.Screen
                name="profile"

                options={{
                    title: 'Profil',
                    tabBarStyle: {
                        backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5',
                        borderTopWidth: 0,
                    },
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
                    animation: 'shift'
                }}
            />

            <Tabs.Screen name="login" options={
                {
                    href: null,
                    animation: 'shift'
                }
            } />
            <Tabs.Screen name="register" options={
                {
                    href: null,
                    animation: 'shift'
                    
                }
            } />
         
        </Tabs>
    );
}
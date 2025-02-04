import { useTheme } from '@/contexts/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { getThemeStyles } from '@/assets/styles/themes';
export default function TabLayout() {
    const { theme } = useTheme();
    const themeStyles = getThemeStyles(theme);
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#007AFF',
                headerTintColor: themeStyles.textSecondary.color,
                tabBarInactiveTintColor: themeStyles.textSecondary.color,
                tabBarStyle: {
                    backgroundColor: themeStyles.content.backgroundColor,
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
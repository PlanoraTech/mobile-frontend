import { getThemeStyles } from '@/assets/styles/themes';
import { useTheme } from '@/contexts/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    const { theme } = useTheme();
    const themeStyles = getThemeStyles(theme);

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: themeStyles.text.color,
            headerTintColor: themeStyles.text.color,
        }}>
            <Tabs.Screen name="timetable" options={{
            headerShown: false,
            tabBarStyle: themeStyles.tabBar,
            tabBarIcon: ({ color, size }) => <MaterialIcons name="schedule" size={size} color={color} />,
            }} />
            <Tabs.Screen name="profile" options={{
            title: 'Profil',
            headerStyle: themeStyles.tabHeader,
            tabBarStyle: themeStyles.tabBar,
            tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
            }} />
        </Tabs>
    );
}
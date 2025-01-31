import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    Switch,
    StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeProvider';
import { getThemeStyles } from '@/assets/styles/themes';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthProvider';
import { ROLE_TRANSLATIONS } from '@/constants';

const ProfileScreen = () => {
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const themeStyles = getThemeStyles(theme);

    const toggleNotifications = () => {
        setIsNotificationsEnabled(previousState => !previousState);
    };

    return (
        <View style={[styles.container, themeStyles.background]}>
            <StatusBar backgroundColor={themeStyles.background.backgroundColor} />
            <View style={[styles.content, themeStyles.content]}>
                {/*
                <View style={styles.nameContainer}>
                <Text style={[styles.name, { color: theme === 'dark' ? '#fff' : '#333' }]}>
                        {user?.token ? 'John Doe' : 'Vendég'}
                    </Text>
                    {user?.token && (
                        <Pressable onPress={() => console.log('Edit name')}>
                            <MaterialIcons
                            name="edit"
                            size={24}
                            color={theme === 'dark' ? '#adadad' : '#666'}
                            />
                            </Pressable>
                            )}
                            </View>
                            */}

                <View style={styles.section}>
                    <Text style={[styles.label, themeStyles.text]}>Szerep</Text>
                    <Text style={[styles.value, themeStyles.text]}>
                        {user?.role ? ROLE_TRANSLATIONS[user.role] : 'Vendég'}
                    </Text>
                </View>


                <View style={styles.section}>
                    <Text style={[styles.label, themeStyles.text]}>Téma</Text>
                    <Switch
                        value={theme === 'dark'}
                        onValueChange={toggleTheme}

                        trackColor={{
                          false: themeStyles.switch.track,
                          true: themeStyles.switch.trackActive
                        }}
                    />
                </View>


                <View style={styles.section}>
                    <Text style={[styles.label, themeStyles.text]}>Értesítések</Text>
                    <Switch
                        value={isNotificationsEnabled}
                        onValueChange={toggleNotifications}

                        trackColor={{
                            false: themeStyles.switch.track,
                            true: themeStyles.switch.trackActive
                        }}
                    />
                </View>


                <View style={styles.authSection}>
                    {!user?.token ? (
                        <>
                            <Pressable
                                style={[styles.authButton, styles.button, themeStyles.button]}
                                onPress={() => router.push('/login')}
                            >
                                <Text style={styles.buttonText}>Bejelentkezés</Text>

                            </Pressable>
                            <Pressable
                                style={[styles.authButton, styles.button, themeStyles.button]}
                                onPress={() => router.push('/register')}
                            >
                                <Text style={styles.buttonText}>Regisztráció</Text>
                            </Pressable>
                        </>
                    ) : (
                        <Pressable
                            style={[styles.authButton, themeStyles.buttonSecondary]}
                            onPress={logout}
                        >
                            <Text style={styles.buttonText}>Kijelentkezés</Text>

                        </Pressable>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        padding: 20,
        borderRadius: 10,
        width: '100%',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        marginBottom: 20
    },
    label: {
        fontSize: 16,
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
    },
    authSection: {
        marginTop: 30,
        gap: 20,
    },
    authButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#2196F3',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProfileScreen;
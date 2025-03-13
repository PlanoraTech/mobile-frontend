import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Linking,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '@/contexts/ThemeProvider';
import { getThemeStyles } from '@/assets/styles/themes';
import { useAuth } from '@/contexts/AuthProvider';
import { BASE_URL, ROLE_TRANSLATIONS, SCREEN_WIDTH } from '@/constants';
import { ModifyPassword } from '@/components/ModifyPassword';
import AbsentModal from '@/components/AbsentModal';
import { useInstitutionId } from '@/contexts/InstitutionIdProvider';
import { Button, Divider, IconButton } from 'react-native-paper';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Switch } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { Institution } from '@/components/Dropdown';

const ProfileScreen = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const { institutionId } = useInstitutionId();
    const themeStyles = getThemeStyles(theme);

    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [absentModalVisible, setAbsentModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsSwitchEnabled(true);
        }, 10);
        return () => clearTimeout(timeout);
    }, []);

    const getInstitution = async (): Promise<Institution> => {
        const response = await fetch(`${BASE_URL}/${institutionId}`, {
            headers: {
                Authorization: `Bearer ${user?.token}`,
            },
        });
        const data = await response.json();
        return data;
    }
    const { data } = useQuery({ queryKey: ['institution', institutionId], queryFn: getInstitution });
    const getCurrentRole = () => {
        const role = user?.institutions.find(institution => institution.institutionId === institutionId)?.role;
        return role || 'GUEST';
    }

    const role = getCurrentRole();

    const toggleNotifications = () => {
        console.log(data);
        setIsNotificationsEnabled(previousState => !previousState);
    };

    const handleLogout = async () => {
        setLoading(true);
        await logout();
        router.push({
            pathname: '/login',
            params: { logout: "true" }
        });
    }

    const openWebsite = () => {
        Linking.openURL(data!.website);
    }

    useFocusEffect(
        useCallback(() => {
            setLoading(false);
        }, [])
    );

    return (
        loading ? (
            <LoadingSpinner />
        ) : (
            <View style={[styles.container, themeStyles.content]}>
                <View style={styles.section}>
                    <Text style={[styles.label, themeStyles.text]}>
                        Intézmény
                    </Text>
                    <IconButton
                        icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                        onPress={() => setIsExpanded(!isExpanded)}
                        size={20} />

                </View>
                {isExpanded &&
                    <View style={styles.nameContainer}>
                        {data?.name ? (
                            <>
                                <Text style={[styles.value, themeStyles.text, { color: data?.color }]}>
                                    Budapesti Fejlesztői Szoftverfejlesztő és technikusi Két Tanítási Nyelvű {data?.name}
                                </Text>
                                <IconButton icon='open-in-new' onPress={openWebsite} />
                            </>
                        ) : (
                            <Text style={[{ textAlign: 'center' }, themeStyles.text]}>
                                Nincs kiválasztva intézmény
                            </Text>
                        )
                        }
                    </View>
                }

                <Divider />
                <View style={styles.section}>
                    <Text style={[styles.label, themeStyles.text]}>
                        Szerep
                    </Text>
                    <Text style={[themeStyles.text]}>
                        {ROLE_TRANSLATIONS[role]}
                    </Text>

                </View>
                <Divider />

                <View style={styles.section}>
                    <Text style={[styles.label, themeStyles.text]}>
                        Téma
                    </Text>
                    {isSwitchEnabled && (
                        <Switch
                            value={theme === 'dark'}
                            onValueChange={toggleTheme} />
                    )}
                </View>
                <Divider />
                <View style={styles.section}>
                    <Text style={[styles.label, themeStyles.text]}>
                        Értesítések
                    </Text>
                    {isSwitchEnabled && (
                        <Switch
                            value={isNotificationsEnabled}
                            onValueChange={toggleNotifications} />
                    )}
                </View>

                {!user?.token ? (
                    <>
                        < Divider />
                        <View style={styles.section}>
                            <Text style={[styles.label, themeStyles.text]}>
                                Bejelentkezés
                            </Text>
                            <IconButton
                                icon='chevron-right'
                                onPress={() => router.push('/login')}
                                size={20} />
                        </View>
                        <Divider />
                        <View style={styles.section}>
                            <Text style={[styles.label, themeStyles.text]}>
                                Regisztráció
                            </Text>
                            <IconButton
                                icon='chevron-right'
                                onPress={() => router.push('/register')}
                                size={20} />
                        </View>
                    </>
                ) : (
                    <>
                        {role !== "GUESTs" &&
                            <>
                                <Divider />
                                <View style={styles.section}>
                                    <Text style={[styles.label, themeStyles.text]}>
                                        Hiányzás kezelése
                                    </Text>
                                    <IconButton
                                        icon='calendar'
                                        onPress={() => setAbsentModalVisible(true)}
                                        size={20} />
                                </View>
                            </>
                        }
                        <AbsentModal
                            visible={absentModalVisible}
                            onDismiss={() => setAbsentModalVisible(false)} />
                        <Divider />
                        <View style={styles.section}>
                            <Text style={[styles.label, themeStyles.text]}>
                                Jelszó módosítása
                            </Text>
                            <IconButton
                                icon='key'
                                onPress={() => setIsPasswordModalVisible(true)}
                                size={20} />
                        </View>
                        <Divider />
                        <ModifyPassword
                            isVisible={isPasswordModalVisible}
                            onClose={() => setIsPasswordModalVisible(false)} />
                        <View style={styles.section}>
                            <Text style={[styles.label, themeStyles.text]}>
                                Kijelentkezés
                            </Text>
                            <IconButton
                                icon='power'
                                onPress={handleLogout}
                                size={20} />
                        </View>
                    </>
                )}
            </View >
        )
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        padding: 20,
        paddingTop: 30
    },

    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
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
        padding: 20,
        height: 60,
        marginBottom: 0
    },
    label: {
        fontSize: 16,
    },
    value: {
        fontSize: 14,
        width: SCREEN_WIDTH * 0.6,
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
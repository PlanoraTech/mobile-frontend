import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
import { Divider, IconButton, Snackbar } from 'react-native-paper';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import { Institution } from '@/components/Dropdown';
import ProfileSection from '@/components/ProfileSection';

const ProfileScreen = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const { institutionId } = useInstitutionId();
    const themeStyles = getThemeStyles(theme);

    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [absentModalVisible, setAbsentModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);

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

    const role = useMemo(() => {
        const role = user?.institutions.find((inst) => inst.institutionId === institutionId)?.role
        console.log("role" + role);
        return role;
    }, [user, institutionId]);

    const toggleNotifications = () => {
        setSnackbarVisible(!snackbarVisible);
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
                <ProfileSection
                    label="Intézmény"
                    icon="home-outline"
                    onPress={() => setIsExpanded(!isExpanded)}
                    actionIcon={isExpanded ? 'chevron-up' : 'chevron-down'}
                />

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
                <ProfileSection
                    label="Szerepkör"
                    icon="account-outline"
                    text={ROLE_TRANSLATIONS[role || "GUEST"]}
                />
                <Divider />

                <ProfileSection
                    label="Téma"
                    icon="theme-light-dark"
                    actionIcon={theme === 'light' ? 'weather-night' : 'weather-sunny'}
                    onPress={toggleTheme}
                />
                <Divider />
                {
                    role !== "GUEST" &&
                    <ProfileSection
                        label="Értesítések"
                        icon="bell-outline"
                        actionIcon={isNotificationsEnabled ? 'bell' : 'bell-off'}
                        onPress={toggleNotifications}
                        disabled={snackbarVisible}
                    />
                }

                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={2500}
                >
                    <Text style={{ color: theme === 'light' ? 'white' : 'black' }}>

                        Értesítések {isNotificationsEnabled ? "bekapcsolva" : "kikapcsolva"}
                    </Text>
                </Snackbar>
                {!user?.token ? (
                    <>
                        < Divider />
                        <ProfileSection
                            label="Bejelentkezés"
                            icon="login"
                            actionIcon='chevron-right'
                            onPress={() => router.push('/login')}
                        />
                        <Divider />
                        <ProfileSection
                            label="Regisztráció"
                            icon="account-plus-outline"
                            actionIcon='chevron-right'
                            onPress={() => router.push('/register')}
                        />
                    </>
                ) : (
                    <>
                        {role !== "GUEST" && role !== "USER" &&
                            <>
                                <Divider />
                                <ProfileSection
                                    label="Hiányzás kezelése"
                                    icon="calendar"
                                    actionIcon=''
                                    onPress={() => setAbsentModalVisible(true)}
                                />
                            </>
                        }
                        <AbsentModal
                            visible={absentModalVisible}
                            onDismiss={() => setAbsentModalVisible(false)} />
                        <Divider />
                        <ProfileSection
                            label="Jelszó módosítása"
                            icon="lock"
                            actionIcon='key'
                            onPress={() => setIsPasswordModalVisible(true)}
                        />
                        <Divider />
                        <ModifyPassword
                            isVisible={isPasswordModalVisible}
                            onClose={() => setIsPasswordModalVisible(false)} />
                        <ProfileSection
                            label="Kijelentkezés"
                            icon="logout"
                            actionIcon='power'
                            onPress={handleLogout}
                        />
                    </>
                )}
            </View >
        )
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        padding: 10,
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
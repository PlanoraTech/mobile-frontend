import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ProfileScreen = ({ isLoggedIn = false, FelhasználóType = 'vendég' }) => {
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const toggleNotifications = () => {
        setIsNotificationsEnabled(previousState => !previousState);
    };

    const toggleTheme = () => {
        setIsDarkTheme(previousState => !previousState);
    };

    return (
        <View style={styles.container}>

            <View style={styles.content}>

                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>
                            {isLoggedIn ? 'John Doe' : 'Vendég   '}
                        </Text>
                        {isLoggedIn && (
                            <Pressable onPress={() => console.log('Edit name')}>
                                <MaterialIcons name="edit" size={24} color="#666" />
                            </Pressable>
                        )}
                    </View>
         

                <View style={styles.section}>
                    <Text style={styles.label}>Szerep</Text>
                    <Text style={styles.value}>
                        {FelhasználóType === 'Előadó' ? 'Előadó' :
                            FelhasználóType === 'Felhasználó' ? 'Felhasználó' : 'Vendég'}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Téma</Text>
                    <Switch
                        value={isDarkTheme}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isDarkTheme ? '#f5dd4b' : '#f4f3f4'}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Értesítések</Text>
                    <Switch
                        value={isNotificationsEnabled}
                        onValueChange={toggleNotifications}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isNotificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
                    />
                </View>

                <View style={styles.authSection}>
                    {!isLoggedIn ? (
                        <>
                            <Pressable
                                style={[styles.authButton, styles.button]}
                                onPress={() => router.push('/screens/login')}
                            >
                                <Text style={styles.buttonText}>Bejelentkezés</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.authButton, styles.button]}
                                onPress={() => router.push('/screens/register' as any)}
                            >
                                <Text style={styles.buttonText}>Regisztráció</Text>
                            </Pressable>
                        </>
                    ) : (
                        <Pressable
                            style={[styles.authButton, styles.logoutButton]}
                            onPress={() => console.log('Logout')}
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
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        width: '100%',
       // borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        marginBottom: 20
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
        color: '#333',
    },
    label: {
        fontSize: 16,
        color: '#666',
    },
    value: {
        fontSize: 16,
        color: '#333',
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
    logoutButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProfileScreen
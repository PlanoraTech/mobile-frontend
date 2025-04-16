import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Button, Checkbox } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthInput } from '@/components/AuthInput';
import { validateEmail, validatePassword } from '@/utils/validation';
import { Link, router, useFocusEffect } from 'expo-router';
import { createAuthStyles } from '@/assets/styles/authStyles';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';
import { StatusMessage } from '@/components/StatusMessage';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function LoginScreen() {
    const styles = createAuthStyles();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setLoading(false);
            setFormData({
                email: '',
                password: '',
                rememberMe: false,
            });
            setErrors({
                email: '',
                password: '',
            });
        }, [])
    );

    const handleLogin = async () => {
        setLoading(true);
        const newErrors = {
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
        };
        setErrors(newErrors);
        if (Object.values(newErrors).some(error => error)) {
            setLoading(false);
            return;
        }
        try {
            await login(formData);
            router.replace('/profile');
        } catch (error: any) {
            setErrorMessage(error.message || 'Sikertelen bejelentkezés');
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView

            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.formContainer}>
                {loading ? <LoadingSpinner /> :
                    <>
                        <Text style={styles.title}>Üdv újra!</Text>
                        <Text style={styles.subtitle}>Jelentkezz be a folytatáshoz</Text>
                        <AuthInput
                            icon="mail-outline"
                            placeholder="Email"
                            value={formData.email}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                            keyboardType="email-address"
                            autoComplete="email"
                        />
                        {errors.email && <Text testID='email-error' style={styles.errorText}>{errors.email}</Text>}
                        <AuthInput
                            icon="lock-closed-outline"
                            placeholder="Jelszó"
                            value={formData.password}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                            secureTextEntry={!showPassword}
                            toggleSecureEntry={() => setShowPassword(!showPassword)}
                        />
                        {errors.password && <Text testID='password-error' style={styles.errorText}>{errors.password}</Text>}
                        <View style={styles.suboptionsContainer}>
                            <View style={styles.checkboxContainer}>
                                <Checkbox
                                    status={formData.rememberMe ? 'checked' : 'unchecked'}
                                    onPress={() => setFormData(prev => ({ ...prev, rememberMe: !formData.rememberMe }))}
                                    color="#007AFF"
                                />
                                <Text style={styles.switchAuthText}>Emlékezz rám</Text>
                            </View>
                         
                        </View>
                        {isModalVisible && <ForgotPasswordModal onClose={() => setIsModalVisible(false)} />}
                        <Button style={styles.authButton} mode="contained" onPress={handleLogin}>
                            Bejelentkezés
                        </Button>
                        <View style={styles.switchAuthContainer}>
                            <Text style={styles.switchAuthText}>Nincs még fiókod? </Text>
                            <Link style={styles.switchAuthLink} href="/register">Regisztáció</Link>
                        </View>
                    </>
                }
            </View>
            {errorMessage && <StatusMessage type='error' message={errorMessage} onClose={() => setErrorMessage('')} />}
        </KeyboardAvoidingView>

    );
}
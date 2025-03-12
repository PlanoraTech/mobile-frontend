import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthInput } from '@/components/AuthInput';
import { validateEmail, validatePassword } from '@/utils/validation';
import { createAuthStyles } from '@/assets/styles/authStyles'
import { Link, router, useFocusEffect } from 'expo-router';
import { StatusMessage } from '@/components/StatusMessage';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from 'react-native-paper';
export default function RegisterScreen() {

    const styles = createAuthStyles();
    const { register } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setLoading(false);
            setFormData({
                email: '',
                password: '',
                confirmPassword: '',
            });
            setErrors({
                email: '',
                password: '',
                confirmPassword: '',
            });
        }, [])
    );

    const handleRegister = async () => {
        setLoading(true);
        const newErrors = {
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
            confirmPassword: validatePassword(formData.confirmPassword),
        };
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'A jelszavak nem egyeznek!';
        }
        setErrors(newErrors);
        if (Object.values(newErrors).some(error => error)) {
            setLoading(false);
            return;
        }
        try {
            await register(formData);
            router.replace('/profile');
        } catch (error: any) {
            setError(error.message || 'Sikertelen regisztráció');
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            {loading ? <LoadingSpinner /> :
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Fiók létrehozása</Text>
                    <Text style={styles.subtitle}>Hozz létre egy fiókot a privát intézmények eléréséhez</Text>
                    <AuthInput
                        icon="mail-outline"
                        placeholder="Email"
                        value={formData.email}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                        keyboardType="email-address"
                        autoComplete="email"
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                    <AuthInput
                        icon="lock-closed-outline"
                        placeholder="Jelszó"
                        value={formData.password}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                        secureTextEntry={!showPassword}
                        toggleSecureEntry={() => setShowPassword(!showPassword)}
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                    <AuthInput
                        icon="lock-closed-outline"
                        placeholder="Jelszó megerősítése"
                        value={formData.confirmPassword}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                        secureTextEntry={!showConfirmPassword}
                        toggleSecureEntry={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                    {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

                    <Button style={styles.authButton} mode="contained" onPress={handleRegister}>
                        <Text style={styles.authButtonText}>Regisztáció</Text>
                    </Button>

                    <View style={styles.switchAuthContainer}>
                        <Text style={styles.switchAuthText}>Van már fiókod? </Text>
                        <Link style={styles.switchAuthLink} href="/login">Bejelentkezés</Link>
                    </View>
                </View>
            }
            {error && <StatusMessage message={error} onClose={() => setError(null)} type={'error'} />}
        </KeyboardAvoidingView>

    );
}
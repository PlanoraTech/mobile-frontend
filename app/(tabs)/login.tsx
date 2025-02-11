import React, { useState } from 'react';
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
import { Link, router } from 'expo-router';
import { createAuthStyles } from '@/assets/styles/authStyles';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';
import { ErrorMessage } from '@/components/ErrorMessage';


export default function LoginScreen() {

    const styles = createAuthStyles();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const checkforErrors = async () => {
        const newErrors = {
            email: !formData.email ? 'Email címet megadni kötelező!' :
                !validateEmail(formData.email) ? 'Érvényes emailt adj meg!' : '',

            password: !formData.password ? 'Jelszót megadni kötelező!' :
                !validatePassword(formData.password) ? 'A jelszónak minimum 6 betűből kell állnia!' : '',
        };

        setErrors(newErrors);
        handleLogin(newErrors);
    };

    const handleLogin = async (newErrors: any) => {
        if (!Object.values(newErrors).some(error => error)) {
            try {
                await login(formData);
                router.replace('/profile');
            } catch (error: any) {
                setErrorMessage(error.message || 'Sikertelen bejelentkezés');
            }
        }
    }

    return (
        <KeyboardAvoidingView

            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.formContainer}>
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
                <Pressable onPress={() => setIsModalVisible(true)}>
                    <Text style={styles.forgotPassword}>Elfelejtetted a jelszót?</Text>
                </Pressable>
                {isModalVisible && <ForgotPasswordModal onClose={() => setIsModalVisible(false)} />}
                <Pressable testID='login-button' style={styles.authButton} onPress={checkforErrors}>
                    <Text style={styles.authButtonText}>Bejelentkezés</Text>
                </Pressable>


                <View style={styles.switchAuthContainer}>
                    <Text style={styles.switchAuthText}>Nincs még fiókod? </Text>
                    <Link style={styles.switchAuthLink} href="/register">Regisztáció</Link>
                </View>
            </View>
            {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />}
        </KeyboardAvoidingView>

    );
}
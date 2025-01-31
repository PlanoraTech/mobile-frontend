import React, { useState } from 'react';
import {
    View,
    Text,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthInput } from '@/components/AuthInput';
import { validateEmail, validatePassword } from '@/utils/validation';
import { Link, router } from 'expo-router';
import { createAuthStyles } from '@/assets/styles/authStyles';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';
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

    const handleLogin = async () => {
        const newErrors = {
            email: !formData.email ? 'Email címet megadni kötelező!' :
                !validateEmail(formData.email) ? 'Érvényes emailt adj meg!' : '',
            password: !formData.password ? 'Jelszót megadni kötelező!' :
                !validatePassword(formData.password) ? 'A jelszónak minimum 6 betűből kell állnia!' : '',
        };

        setErrors(newErrors);

        if (!Object.values(newErrors).some(error => error)) {
            const success = await login(formData);
            if (success) {
                router.replace('/profile');
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="auto" />
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
                <Pressable onPress={() => setIsModalVisible(true)}>
                <Text style={styles.forgotPassword}>Elfelejtetted a jelszót?</Text>
                </Pressable>
                {isModalVisible &&<ForgotPasswordModal onClose={() => setIsModalVisible(false)} />}
                <Pressable style={styles.authButton} onPress={handleLogin}>
                    <Text style={styles.authButtonText}>Bejelentkezés</Text>
                </Pressable>

                <View style={styles.switchAuthContainer}>
                    <Text style={styles.switchAuthText}>Nincs még fiókod? </Text>
                    <Link style={styles.switchAuthLink} href="/register">Regisztáció</Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
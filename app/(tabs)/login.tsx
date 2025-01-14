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
import { styles } from '@/assets/styles/authStyles'
import { Link } from 'expo-router';
export default function LoginScreen() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        const newErrors = {
            email: !formData.email ? 'Email címet megadni kötelező!' :
                !validateEmail(formData.email) ? 'Érvényes Emailt adj meg!' : '',
            password: !formData.password ? 'Jelszót megadni kötelező!' :
                !validatePassword(formData.password) ? 'A jelszónak minimum 6 betűből kell állnia!' : '',
        };

        setErrors(newErrors);

        if (!Object.values(newErrors).some(error => error)) {
            login(formData);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="auto" />
            <ScrollView style={styles.formContainer}>
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

                <Link style={styles.forgotPassword} href="/login">Elfelejtetted a jelszót?</Link>

                <Pressable style={styles.authButton} onPress={handleLogin}>
                    <Text style={styles.authButtonText}>Bejelentkezés</Text>
                </Pressable>

                <View style={styles.switchAuthContainer}>
                    <Text style={styles.switchAuthText}>Nincs még fiókod? </Text>
                    <Link style={styles.switchAuthLink} href="/register">Regisztáció</Link>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
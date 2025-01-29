import React, { useState } from 'react';
import {
    View,
    Text,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthInput } from '@/components/AuthInput';
import { validateEmail, validatePassword, validateName } from '@/utils/validation';
import {createAuthStyles} from '@/assets/styles/authStyles'
import { Link } from 'expo-router';

export default function RegisterScreen() {  
    
    const styles = createAuthStyles();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({
       // firstName: '',
        //lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = () => {
        const newErrors = {
            /*
            firstName: !formData.firstName ? 'Keresztnevet megadni kötelező!' :
                      !validateName(formData.firstName) ? 'A keresznév minimum 2 betű!' : '',
            lastName: !formData.lastName ? 'Vezetéknevet megadni kötelező!' :
                     !validateName(formData.lastName) ? 'A vezetéknév minimum 2 betű!' : '',
                     */
            email: !formData.email ? 'Email címet megadni kötelező!' :
                  !validateEmail(formData.email) ? 'Érvényes Email címet adj meg!' : '',
            password: !formData.password ? 'Jelszót megadni kötelező!' :
                     !validatePassword(formData.password) ? 'A jelszó minimum 6 betű!' : '',
            confirmPassword: !formData.confirmPassword ? 'Kérlek, erősítsd meg a jelszavad!' :
                           formData.password !== formData.confirmPassword ? 'A jelszavak nem egyeznek!' : '',
        };

        setErrors(newErrors);

        if (!Object.values(newErrors).some(error => error)) {
            register(formData);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="auto" />
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

                <Pressable style={styles.authButton} onPress={handleRegister}>
                    <Text style={styles.authButtonText}>Regisztáció</Text>
                </Pressable>

                <View style={styles.switchAuthContainer}>
                    <Text style={styles.switchAuthText}>Van már fiókod? </Text>
                    <Link style={styles.switchAuthLink} href="/login">Bejelentkezés</Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
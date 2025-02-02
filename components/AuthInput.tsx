import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeProvider';
import { getThemeStyles } from '@/assets/styles/themes';
interface AuthInputProps {
    icon: keyof typeof Ionicons.glyphMap;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    toggleSecureEntry?: () => void;
    keyboardType?: 'default' | 'email-address';
    autoCapitalize?: 'none' | 'sentences';
    autoComplete?: 'name' | 'email' | 'password' | 'off' | undefined;
}

export const AuthInput = ({
    icon,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    toggleSecureEntry,
    keyboardType = 'default',
    autoCapitalize = 'none',
    autoComplete,
}: AuthInputProps) => {
    const { theme } = useTheme();
    const themeStyles = getThemeStyles(theme);
    return <View style={[styles.inputContainer, themeStyles.inputBackground ]}>
        <Ionicons name={icon} size={24} color="#666" style={styles.icon} />
        <TextInput


            style={[
                styles.input,
                secureTextEntry && styles.passwordInput,
                themeStyles.text,
            ]}
            placeholder={placeholder}
            value={value}
            placeholderTextColor={themeStyles.textSecondary.color}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}

            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoComplete={autoComplete}
        />
        {toggleSecureEntry && (
            <Pressable onPress={toggleSecureEntry} style={styles.eyeIcon}>
                <Ionicons
                    name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#666"
                />
            </Pressable>
        )}
    </View>
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
    },
});
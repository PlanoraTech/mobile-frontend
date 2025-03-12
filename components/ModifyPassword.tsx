
import { AuthInput } from "./AuthInput";
import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "@/contexts/ThemeProvider";
import { getThemeStyles } from "@/assets/styles/themes";
import { Button, Modal, Portal } from "react-native-paper";
import { BASE_URL, BASE_URL_AUTH } from "@/constants";
import { useAuth } from "@/contexts/AuthProvider";
import { StatusMessage } from "./StatusMessage";
import { validatePassword } from "@/utils/validation";
interface ForgotPasswordModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export const ModifyPassword = ({ isVisible, onClose }: ForgotPasswordModalProps) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const themeStyles = getThemeStyles(theme);
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });
    const [errors, setErrors] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const modifyPassword = async () => {
        try {
            const newErrors = {
                oldPassword: validatePassword(formData.oldPassword),
                newPassword: validatePassword(formData.newPassword),
                confirmPassword: validatePassword(formData.confirmPassword),
            };
            setErrors(newErrors);
            if (!Object.values(newErrors).some(error => error)) {
                setError('');
                setSuccess('');
                const response = await fetch(`${BASE_URL_AUTH}/profile?token=${user?.token}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        oldPassword: formData.oldPassword,
                        newPassword: formData.newPassword,
                    }),
                });
                console.log(JSON.stringify({
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                }));
                console.log(response.status);
                console.log(await response.text());
                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        setError("Nincs jogosultságod a művelethez");
                        return;
                    }
                    if (response.status === 400) {
                        setError("Hibás kérés");
                        return;
                    }
                }
                setSuccess("Jelszó módosítva");
                setFormData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                onClose();
            }
        } catch (error: any) {
            console.error(error);
            setError("Ismeretlen hiba történt...");
        }
    }
    const handleClose = () => {
        setFormData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setShowPassword({
            oldPassword: false,
            newPassword: false,
            confirmPassword: false,
        });
        setErrors({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        onClose();
    }
    return (
        <Portal>
            <Modal
                visible={isVisible}
                onDismiss={handleClose}
                contentContainerStyle={[styles.modalContent, themeStyles.content]}
            >
                <View style={[styles.modalHeader, themeStyles.border]}>
                    <Text style={[styles.headerText, themeStyles.textSecondary]}>
                        Jelszó módosítása
                    </Text>
                    <Pressable onPress={handleClose} style={styles.closeButton}>
                        <Text style={[styles.closeButtonText, themeStyles.textSecondary]}>×</Text>
                    </Pressable>
                </View>
                <View>
                    <AuthInput
                        icon="lock-closed-outline"
                        placeholder="Régi jelszó"
                        value={formData.oldPassword}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, oldPassword: text }))}
                        keyboardType="default"
                        secureTextEntry={!showPassword.oldPassword}
                        toggleSecureEntry={() => setShowPassword(prev => ({ ...prev, oldPassword: !prev.oldPassword }))}
                        autoComplete="password"
                    />
                    {errors.oldPassword && <Text style={styles.errorText}>{errors.oldPassword}</Text>}
                    <AuthInput
                        icon="lock-closed-outline"
                        placeholder="Új jelszó"
                        value={formData.newPassword}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, newPassword: text }))}
                        keyboardType="default"
                        autoComplete="password"
                        secureTextEntry={!showPassword.newPassword}
                        toggleSecureEntry={() => setShowPassword(prev => ({ ...prev, newPassword: !prev.newPassword }))}
                    />
                    {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
                    <AuthInput
                        icon="lock-closed-outline"
                        placeholder="Jelszó megerősítése"
                        value={formData.confirmPassword}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                        keyboardType="default"
                        secureTextEntry={!showPassword.confirmPassword}
                        toggleSecureEntry={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                    />
                    {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    <Button mode="contained" onPress={modifyPassword}>
                        Módosítás
                    </Button>
                </View>
            </Modal>
            {error && <StatusMessage message={error} type="error" />}
            {success && <StatusMessage message={success} type="success" />}
        </Portal>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 0.5
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 24,
        fontWeight: '400',
    },
    submitButton: {
        marginTop: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '600',
    },
    errorText: {
        color: 'red',
        marginTop: -12,
        marginBottom: 16,
        marginLeft: 16,
    },
});

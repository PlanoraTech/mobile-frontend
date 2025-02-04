import { Modal, Pressable } from "react-native";
import { AuthInput } from "./AuthInput";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeProvider";
import { getThemeStyles } from "@/assets/styles/themes";
import { StatusBar } from "expo-status-bar";
interface ForgotPasswordModalProps {
    onClose: () => void;
}


export default function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });



    const themeStyles = getThemeStyles(theme);

    return (
        <Modal
            animationType="fade"

            transparent={true}
            visible={true}
            onRequestClose={onClose}
        >
            <StatusBar backgroundColor='rgba(0, 0, 0, 0.3)' />
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, themeStyles.content]}>
                    <View style={[styles.modalHeader, themeStyles.border]}>


                        <Text style={[styles.headerText, themeStyles.textSecondary]}>
                            Jelszó módosítása

                        </Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
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
                            secureTextEntry={true}

                        />
                        <AuthInput
                            icon="lock-closed-outline"
                            placeholder="Új jelszó"
                            value={formData.newPassword}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, newPassword: text }))}
                            keyboardType="default"
                            autoComplete="password"
                            secureTextEntry={true}
                        />
                        <AuthInput
                            icon="lock-closed-outline"
                            placeholder="Jelszó megerősítése"
                            value={formData.confirmPassword}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                            keyboardType="default"
                            secureTextEntry={true}
                        />


                        <Pressable onPress={onClose} style={[styles.submitButton, themeStyles.button]}>
                            <Text style={styles.submitButtonText}>Módosítás</Text>

                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 16,
        width: '85%',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
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
});

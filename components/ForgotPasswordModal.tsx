import { Modal, Pressable } from "react-native";
import { AuthInput } from "./AuthInput";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeProvider";
import { getThemeStyles } from "@/assets/styles/themes";
interface ForgotPasswordModalProps {
    onClose: () => void;
}


export default function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        email: '',
    });

    const themeStyles = getThemeStyles(theme);

    return (
        <Modal
            animationType="fade"

            transparent={true}
            visible={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, themeStyles.content]}>
                    <View style={styles.modalHeader}>

                        <Text style={[styles.headerText, themeStyles.textSecondary]}>
                            Elfelejtett Jelszó

                        </Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Text style={[styles.closeButtonText, themeStyles.textSecondary]}>×</Text>
                        </Pressable>
                    </View>
                    <View>

                        <AuthInput
                            icon="mail-outline"
                            placeholder="Email"
                            value={formData.email}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                            keyboardType="email-address"
                            autoComplete="email"
                        />
                        <Pressable onPress={onClose} style={[styles.submitButton, themeStyles.button]}>
                            <Text style={styles.submitButtonText}>Küldés</Text>
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

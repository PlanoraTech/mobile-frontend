import { getThemeStyles } from "@/assets/styles/themes";
import { useTheme } from "@/contexts/ThemeProvider";
import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
interface AddEventModalProps {
    isVisible: boolean;
    dayDate: Date;
    onClose: () => void;
}
export const AddEventModal = ({ isVisible, dayDate, onClose }: AddEventModalProps) => {
    const { theme } = useTheme();
    const themeStyles = getThemeStyles(theme);
    const [newTitle, setNewTitle] = useState("");
    return (
        <Modal
            visible={isVisible}
            transparent={true}
            onRequestClose={onClose}
            animationType="fade"
        >
            <StatusBar backgroundColor='rgba(0, 0, 0, 0.3)' />
            <View style={[styles.modalContainer, ]}>
            <View style={[styles.modalContent, themeStyles.content]}>
                <View style={[styles.modalHeader, themeStyles.border]} >
                    <Text style={[styles.modalTitle, themeStyles.textSecondary]}>
                        Esemény létrehozása
                    </Text>

                    <Pressable onPress={onClose} style={[styles.closeButton]}>
                        <Text style={[styles.closeButtonText, themeStyles.textSecondary]}>×</Text>
                    </Pressable>
                </View>
                <TextInput
                    style={[
                        styles.input,
                        themeStyles.inputBackground,
                        themeStyles.text,
                    ]}
                    multiline={true}
                    value={newTitle}
                    onChangeText={(text) => setNewTitle(text)}
                    autoCapitalize="sentences"
                />
                <View style={styles.ButtonsContainer}>
                    <Pressable style={[styles.saveButton, themeStyles.button]}>
                        <Text style={styles.saveButtonText}>Hozzáadás</Text>
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
        width: '80%',
        borderRadius: 8,
        padding: 15,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: '600',  
    },
    input: {
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },

    ButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    saveButton: {
        padding: 10,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
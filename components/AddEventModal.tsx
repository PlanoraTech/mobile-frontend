import { getThemeStyles } from "@/assets/styles/themes";
import { useTheme } from "@/contexts/ThemeProvider";
import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View, StyleSheet } from "react-native";

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
            <View style={[styles.modalContainer, ]}>
            <View style={[styles.modalContent, themeStyles.content]}>
                <View style={[styles.modalHeader, {borderBottomColor: theme === 'dark' ? '#333' : '#fff'}]} >
                    <Text style={[styles.modalTitle, themeStyles.text]}>
                        Esemény létrehozása
                    </Text>
                    <Pressable onPress={onClose} style={[styles.closeButton]}>
                        <Text style={[styles.closeButtonText, themeStyles.text]}>x</Text>
                    </Pressable>
                </View>
                <TextInput
                    style={[
                        styles.input,
                        { backgroundColor: theme === 'dark' ? '#343434' : '#e0e0e0' },
                        { color: theme === 'dark' ? '#fff' : '#333' },
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',   
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
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
        fontSize: 20,
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
        backgroundColor: '#007aff',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
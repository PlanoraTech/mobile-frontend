import { getThemeStyles } from "@/assets/styles/themes";
import { useTheme } from "@/contexts/ThemeProvider";
import { DayEvent } from "@/types";
import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View, StyleSheet } from "react-native";

interface EventModalProps {
    isVisible: boolean;
    event: DayEvent;
    onClose: () => void;
}

export const EventModal = ({ isVisible, event, onClose }: EventModalProps) => {
    const { theme } = useTheme();
    const themeStyles = getThemeStyles(theme);
    const [newTitle, setNewTitle] = useState(event.title);
    return (
        <Modal
            visible={isVisible}
            transparent={true}
            onRequestClose={onClose}
            style={styles.modal}
        >
            <View style={[styles.modalContent, themeStyles.content]}>
                <View style={styles.modalHeader}>
                    <Text style={[styles.modalTitle, themeStyles.text]}>
                        Esemény szerkesztése
                    </Text>
                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <Text style={[styles.closeButtonText, themeStyles.text]}>Close</Text>
                    </Pressable>
                </View>
                <TextInput
                    style={[
                        styles.input,
                        { color: theme === 'dark' ? '#fff' : '#333' },
                    ]}
                    multiline={true}
                    value={event.title}
                    placeholderTextColor={theme === 'dark' ? '#adadad' : '#666'}
                    onChangeText={(text) => setNewTitle(text)}
                    autoCapitalize="sentences"
                />
                <View style={styles.ButtonsContainer}>
                    <Pressable style={styles.deleteButton}>
                        <Text style={[styles.deleteButtonText, themeStyles.text]}>Esemény törlése</Text>
                    </Pressable>
                    <Pressable style={styles.saveButton}>
                        <Text style={[styles.saveButtonText, themeStyles.text]}>Mentés</Text>
                    </Pressable>
                </View>

            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
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
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        color: '#007aff',
    },
    input: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        marginBottom: 15,
    },
    ButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    deleteButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#ff3b30',
    },
    deleteButtonText: {
        color: '#fff',
    },
    saveButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#007aff',
    },
    saveButtonText: {
        color: '#fff',
    },
});
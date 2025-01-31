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
    const handleClose = () => {
        setNewTitle(event.title);
        onClose();
    }
    return (
        <Modal
            visible={isVisible}
            transparent={true}
            onRequestClose={onClose}
            animationType="fade"
        >
            <View style={[styles.modalContainer, ]}>
            <View style={[styles.modalContent, themeStyles.content]}>
                <View style={[styles.modalHeader, themeStyles.border]} >
                    <Text style={[styles.modalTitle, themeStyles.textSecondary]}>
                        Esemény szerkesztése
                    </Text>

                    <Pressable onPress={handleClose} style={[styles.closeButton]}>
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
                    <Pressable style={[styles.deleteButton, themeStyles.buttonSecondary]}>
                        <Text style={styles.buttonText}>Esemény törlése</Text>
                    </Pressable>
                    <Pressable style={[styles.saveButton, themeStyles.button]}>

                        <Text style={styles.buttonText}>Mentés</Text>
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
        justifyContent: 'space-between',
    },
    deleteButton: {
        padding: 10,
        borderRadius: 8,

    },
    deleteButtonText: {
        color: '#fff',
    },
    saveButton: {
        padding: 10,
        borderRadius: 8,
        
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
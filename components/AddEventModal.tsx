
import { BASE_URL } from "@/constants";
import { useAuth } from "@/contexts/AuthProvider";
import { useInstitutionId } from "@/contexts/InstitutionIdProvider";
import { useState } from "react";
import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { Button, Modal, Portal, useTheme } from "react-native-paper";
import { StatusMessage } from "./StatusMessage";
import { AuthInput } from "./AuthInput";

interface AddEventModalProps {
    isVisible: boolean;
    currentDayDate: Date;
    onClose: () => void;
}
export const AddEventModal = ({ isVisible, currentDayDate, onClose }: AddEventModalProps) => {
    const theme = useTheme();
    const [newTitle, setNewTitle] = useState("");
    const { user } = useAuth();
    const { institutionId } = useInstitutionId();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleAdd = async () => {
        if (!newTitle) {
            return;
        }
        try {
            setError("");
            setSuccess("");
            const newEvent = {
                title: newTitle,
                date: currentDayDate,
            }
            console.log(`url: ${BASE_URL}/${institutionId}/events`);
            const response = await fetch(`${BASE_URL}/${institutionId}/events/?token=${user?.token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEvent),
            });
            console.log('newEvent', JSON.stringify(newEvent));
            console.log('response', response.status);
            console.log('response', await response.text());
            if (response.status === 401 || response.status === 403) {
                setError("Nincs jogosultságod a művelethez");
                return;
            }
            setSuccess("Sikeresen hozzáadva");
            onClose();
        } catch (error: any) {
            console.error(error);
            setError("Ismeretlen hiba történt...");
        }
    }
    return (
        <Portal>
            <Modal
                visible={isVisible}
                onDismiss={onClose}
                contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
            >

                <View style={[styles.modalHeader, { borderColor: theme.colors.outline }]} >
                    <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
                        Esemény létrehozása
                    </Text>

                    <Pressable onPress={onClose} style={[styles.closeButton]}>
                        <Text style={[styles.closeButtonText, { color: theme.colors.onSurface }]}>×</Text>
                    </Pressable>
                </View>
                <AuthInput
                    icon="calendar-outline"
                    placeholder="Esemény leírása"
                    value={newTitle}
                    onChangeText={(text) => setNewTitle(text)}
                />
                <View style={styles.ButtonsContainer}>
                    <Button mode="contained" onPress={handleAdd}>
                        <Text style={styles.saveButtonText}>Hozzáadás</Text>
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
        borderRadius: 8,
        padding: 15,
        marginHorizontal: 15,
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
import { BASE_URL } from "@/constants";
import { useAuth } from "@/contexts/AuthProvider";
import { useInstitutionId } from "@/contexts/InstitutionIdProvider";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button, Modal, Portal, useTheme, IconButton } from "react-native-paper";
import { StatusMessage } from "./StatusMessage";
import { AuthInput } from "./AuthInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    const queryClient = useQueryClient();

    const addEventMutation = useMutation({
        mutationFn: async () => {
            const newEvent = { title: newTitle, date: currentDayDate };
            const response = await fetch(`${BASE_URL}/${institutionId}/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}`,
                },
                body: JSON.stringify(newEvent),
            });

            if (response.status === 401 || response.status === 403) {
                throw new Error("Nincs jogosultságod a művelethez");
            }
            if (!response.ok) {
                throw new Error("Nem sikerült hozzáadni az eseményt");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events", institutionId] }); // Invalidate events query
            setSuccess("Sikeresen hozzáadva");
            onClose();
        },
        onError: (error: any) => {
            setError(error.message || "Ismeretlen hiba történt...");
        },
    });

    return (
        <Portal>
            <Modal
                visible={isVisible}
                onDismiss={onClose}
                contentContainerStyle={[
                    styles.modalContent,
                    { backgroundColor: theme.colors.surface }
                ]}
            >
                <View style={[styles.modalHeader, { borderColor: theme.colors.outline }]}>
                    <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>Esemény létrehozása</Text>
                    <IconButton icon="close" size={24} onPress={onClose} iconColor={theme.colors.onSurface} />
                </View>

                <AuthInput
                    icon="calendar-outline"
                    placeholder="Esemény leírása"
                    value={newTitle}
                    onChangeText={setNewTitle}
                />

                <View style={styles.ButtonsContainer}>
                    <Button mode="contained" onPress={() => addEventMutation.mutate()}>
                        <Text style={styles.saveButtonText}>Hozzáadás</Text>
                    </Button>
                </View>
            </Modal>

            {error && <StatusMessage message={error} type="error" />}
            {success && <StatusMessage message={success} type="success" />}
        </Portal>
    );
};

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
    ButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});

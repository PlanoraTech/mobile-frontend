import { BASE_URL } from "@/constants";
import { useInstitutionId } from "@/contexts/InstitutionIdProvider";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Button, IconButton, Modal, Portal, Text, useTheme } from 'react-native-paper';
import { StatusMessage } from "./StatusMessage";
import { useAuth } from "@/contexts/AuthProvider";


interface EventModalProps {
    isVisible: boolean;
    event: DayEvent;
    onClose: (title: string) => void;
    title: string;
}

export interface DayEvent {
    id: string;
    date: Date;
}

export const EventModal = ({ isVisible, event, title, onClose }: EventModalProps) => {
    const theme = useTheme();
    const [newTitle, setNewTitle] = useState(title);
    const { institutionId } = useInstitutionId();
    const { user } = useAuth()
    const handleClose = () => {
        onClose(newTitle);
    }

    const { mutate: modifyEvent, error } = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${BASE_URL}/${institutionId}/events/${event.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                    title: newTitle,
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

        },
        onSuccess: () => {
            handleClose();
        },
        onError: (error) => {
            console.error('Error:', error);
        }

    });



    return (
        <Portal>
            <Modal
                visible={isVisible}
                onDismiss={handleClose}
                contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
            >

                <View style={[styles.modalHeader, { borderBottomColor: theme.colors.outline }]}>
                    <Text variant="titleLarge" >
                        Esemény módosítása
                    </Text>

                    <IconButton
                        icon="close"
                        size={24}
                        onPress={handleClose}
                    />
                </View>

                <TextInput
                    style={[
                        styles.input,
                        { backgroundColor: theme.colors.surfaceDisabled },
                        { borderColor: theme.colors.outline },
                        { color: theme.colors.onSurface },
                    ]}
                    multiline={true}
                    defaultValue={newTitle}
                    onChangeText={(text) => setNewTitle(text)}
                    autoCapitalize="sentences"
                />


                <View style={styles.ButtonsContainer}>
                    <Button
                        mode="contained"
                        onPress={() => {
                        }}
                        buttonColor={theme.colors.secondary}
                    >
                        Esemény törlése
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => modifyEvent()}
                    >
                        Mentés
                    </Button>
                </View>
            </Modal>
            {error && <StatusMessage message={error.message || "Hiba történt"} type="error" />}
        </Portal>

    );
}

const styles = StyleSheet.create({
    modalContainer: {
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
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
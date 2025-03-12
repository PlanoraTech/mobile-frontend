import { Button, Chip, Modal, Portal, useTheme } from "react-native-paper";
import { FlatList, StyleSheet, View } from "react-native";
import DropdownComponent, { DropdownItem } from "./Dropdown";
import { useEffect, useState } from "react";
import ModalHeader from "./ModalHeader";
import { StatusMessage } from "./StatusMessage";

interface Props {
    visible: boolean;
    onDismiss: () => void;
    rooms: DropdownItem[];
}

const roomChangeModal = ({ rooms, visible, onDismiss }: Props) => {
    const theme = useTheme();
    const [selectedRooms, setSelectedRooms] = useState<DropdownItem[]>(rooms);
    const [availableRooms, setAvailableRooms] = useState<DropdownItem[]>([
        { id: "1", name: "Room 1" },
        { id: "2", name: "Room 2" },
        { id: "3", name: "Room 3" },
        { id: "4", name: "Room 4" },
        { id: "5", name: "Room 5" },
        { id: "6", name: "Room 6" },
        { id: "7", name: "Room 7" },
        { id: "8", name: "Room 8" },
        { id: "9", name: "Room 9" },
        { id: "10", name: "Room 10" },
        { id: "11", name: "Room 11" },
        { id: "12", name: "Room 12" },
        { id: "13", name: "Room 13" },
        { id: "14", name: "Room 14" },
        { id: "15", name: "Room 15" },
        { id: "16", name: "Room 16" },

    ]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const handleDelete = (item: DropdownItem) => {
        setSelectedRooms(selectedRooms.filter(r => r.id !== item.id));
        setAvailableRooms([...availableRooms, item]);
    }

    const addRoom = (room: DropdownItem) => {
        console.log(room);
        setSelectedRooms([...selectedRooms, room]);
        setAvailableRooms(availableRooms.filter(r => r.id !== room.id));
    }

    const handleClose = () => {
        onDismiss();
    }

    const handleConfirm = async () => {
        try {
            setError("");
            setSuccess("");
            const response = await fetch('https://api.example.com/rooms', {
                method: 'POST',
                body: JSON.stringify(selectedRooms),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    setError("Nincs jogosultságod a művelethez");
                }
                if (response.status === 400) {
                    setError("Hibás kérés");
                }
            }
            setSuccess("Sikeres művelet");
        } catch (error: any) {
            console.error(error.message);
            setError("Ismeretlen hiba történt...");
        }
    }

    useEffect(() => {
        const fetchAvailableRooms = async () => {
            setSelectedRooms(rooms);
            setError("");
            try {
                const response = await fetch('https://api.example.com/rooms');
                if (response.status === 401 || response.status === 403) {
                    setError("Nincs jogosultságod a lekéréshez");
                    return;
                }
                const data = await response.json();
                setAvailableRooms(data);
            } catch (error: any) {
                setError("Ismeretlen hiba történt...");
            }
        }
        fetchAvailableRooms();
    }, []);

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={handleClose}
                dismissable={true}
                contentContainerStyle={[
                    styles.modalContainer,
                    {
                        backgroundColor: theme.colors.surface,
                    }
                ]}
            >
                <ModalHeader title="Termek" handleClose={handleClose} />
                <FlatList
                    data={selectedRooms}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    renderItem={({ item }) =>
                        <Chip onClose={() => handleDelete(item)} closeIcon={"close"} mode="outlined">{item.name}</Chip>
                    }
                    keyExtractor={(item) => item.id}
                    style={{ marginBottom: 20 }}
                />
                <DropdownComponent onSelect={addRoom} data={availableRooms} placeholder="Terem hozzáadása" />
                <View style={styles.buttonsContainer}>
                    <Button mode="contained" onPress={handleClose}>
                        Mégse
                    </Button>
                    <Button mode="contained" onPress={handleConfirm}>
                        Megerősítés
                    </Button>
                </View>
            </Modal>
            {error && <StatusMessage message={error} type="error" />}
            {success && <StatusMessage message={success} type="success" />}
        </Portal>

    );
}

export default roomChangeModal;

const styles = StyleSheet.create({
    modalContainer: {
        padding: 20,
        borderRadius: 10,
        marginBottom: 100,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    }
});
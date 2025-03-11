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

            switch (response.status) {
                case 401:
                    throw new Error("Nincs jogosultság");
                case 403:
                    throw new Error("Hozzáférés megtagadva");
                case 400:
                    throw new Error("Hibás kérés");
                default:
                    throw new Error("Ismeretlen hiba");
            }
        } catch (error: any) {
            setError(error.message || "Hiba a szerver elérése közben");
        } finally {
            setSuccess("Sikeres mentés");
            //onDismiss();
        }
    }

    useEffect(() => {
        setError("");
        setSelectedRooms(rooms);
        const fetchAvailableRooms = async () => {
            try {
                const response = await fetch('https://api.example.com/rooms');
                if (response.status === 401) {
                    throw new Error("Nincs jogosultság");
                }
                if (response.status === 403) {
                    throw new Error("Hozzáférés megtagadva");
                }
                const data = await response.json();
                setAvailableRooms(data);
            } catch (error: any) {
                setError(error.message || "Hiba a szerver elérése közben");
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
                    scrollEnabled={false}
                />

                <DropdownComponent maxHeight={selectedRooms.length >= 3 ? 135 : 180} onSelect={addRoom} data={availableRooms} placeholder="Terem hozzáadása" />
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
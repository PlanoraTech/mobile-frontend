import { Button, Chip, Modal, Portal, useTheme } from "react-native-paper";
import { FlatList, StyleSheet, View } from "react-native";
import DropdownComponent, { DropdownItem } from "./Dropdown";
import { useEffect, useState } from "react";
import ModalHeader from "./ModalHeader";
import { StatusMessage } from "./StatusMessage";
import { useInstitutionId } from "@/contexts/InstitutionIdProvider";
import { confirmRoomSelection, fetchAvailableRooms } from "@/queryOptions/roomChangeFunctions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "./LoadingSpinner";
import { useAuth } from "@/contexts/AuthProvider";
import { useTimetable } from "@/contexts/TimetableProvider";

interface Props {
    visible: boolean;
    onDismiss: () => void;
    rooms: DropdownItem[];
    appointmentId?: string;
}

const RoomChangeModal = ({ rooms, visible, onDismiss, appointmentId }: Props) => {
    const theme = useTheme();
    const { user } = useAuth();
    const { institutionId } = useInstitutionId();
    const [selectedRooms, setSelectedRooms] = useState<DropdownItem[]>(rooms);
    const { timetable } = useTimetable();
    const [availableRooms, setAvailableRooms] = useState<DropdownItem[]>([
        { id: "", name: "Kérlek várj..." },
    ]);
    
    const queryClient = useQueryClient();
    
    const { data: fetchedRooms = [], error, isLoading } = useQuery({
        queryKey: ['availableRooms', institutionId],
        queryFn: () => fetchAvailableRooms(institutionId, user?.token!, appointmentId!, timetable),
        enabled: visible && !!user?.token && !!appointmentId,
    });
    
    const { mutate, isPending, isSuccess, error: confirmError } = useMutation({
        mutationFn: () => confirmRoomSelection(institutionId, selectedRooms, user?.token!, appointmentId!, timetable),
        onMutate: () => {
            handleClose();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timetable'] });
        },
    });
    
    useEffect(() => {
        if (visible && !isLoading && fetchedRooms.length > 0) {
            setSelectedRooms(rooms);
            setAvailableRooms(fetchedRooms);
        }
    }, [visible, isLoading, fetchedRooms, rooms]);
    
    const handleDelete = (item: DropdownItem) => {
        setSelectedRooms(selectedRooms.filter(r => r.id !== item.id));
        setAvailableRooms([...availableRooms, item]);
    }

    const addRoom = (room: DropdownItem) => {
        setSelectedRooms([...selectedRooms, room]);
        setAvailableRooms(availableRooms.filter(r => r.id !== room.id));
    }

    const handleClose = () => {
        onDismiss();
    }

    const handleConfirm = () => {
        mutate();
    };

    const renderContent = () => {
        if (isPending || isLoading) {
            return <LoadingSpinner />;
        }
        
        return (
            <>
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
            </>
        );
    };

    return (
        <Portal>
            <Modal
                visible={visible && !isPending}
                onDismiss={handleClose}
                dismissable={true}
                contentContainerStyle={[
                    styles.modalContainer,
                    {
                        backgroundColor: theme.colors.surface,
                    }
                ]}
            >
                {renderContent()}
            </Modal>
            {error && <StatusMessage message={error.message} type="error" />}
            {confirmError && <StatusMessage message={confirmError.message} type="error" />}
            {isSuccess && <StatusMessage message={"Sikeres módosítás!"} type="success" />}
        </Portal>
    );
};

export default RoomChangeModal;

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
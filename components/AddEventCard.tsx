import React, { useState } from "react";
import { AddEventModal } from "./AddEventModal";
import { Button } from "react-native-paper";

export interface EventCardProps {
    currentDayDate: Date;
}

export const AddEventCard = ({ currentDayDate }: EventCardProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    return (
        <>
            <Button mode="contained" onPress={() => setIsModalVisible(true)}>
                Esemény hozzáadása
            </Button>
            <AddEventModal currentDayDate={currentDayDate} isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
        </>
    );
}

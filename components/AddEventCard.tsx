import { getThemeStyles } from "@/assets/styles/themes";
import { useTheme } from "@/contexts/ThemeProvider";
import { useState } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { AddEventModal } from "./AddEventModal";

export interface EventCardProps {
    currentDayDate: Date;
}

export const AddEventCard = ({ currentDayDate }: EventCardProps) => {
    const { theme } = useTheme();
    const themeStyles = getThemeStyles(theme);
    const [isModalVisible, setIsModalVisible] = useState(false);
    return (
        <Pressable
            onPress={() => setIsModalVisible(true)}
            style={[styles.eventCard, themeStyles.content]}
        >
            <Text style={[styles.eventTitle, themeStyles.text]}>
                +
            </Text>
            
            <AddEventModal isVisible={isModalVisible} dayDate={currentDayDate} onClose={() => setIsModalVisible(false)} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    eventCard: {
        padding: 15,
        borderRadius: 8,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
});
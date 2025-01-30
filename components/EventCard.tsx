import { getThemeStyles } from "@/assets/styles/themes";
import { useTheme } from "@/contexts/ThemeProvider";
import { DayEvent } from "@/types";
import { useState } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { EventModal } from "./EventModal";

interface EventCardProps {
    event: DayEvent;
}

export const EventCard = ({ event }: EventCardProps) => {
    const { theme } = useTheme();
    const themeStyles = getThemeStyles(theme);
    const [isModalVisible, setIsModalVisible] = useState(false);
    return (
        <Pressable
            onPress={() => setIsModalVisible(true)}
            style={[styles.eventCard, themeStyles.content]}
        >
            <Text style={[styles.eventTitle, themeStyles.text]}>
                {event.title}
            </Text>
            
            <EventModal isVisible={isModalVisible} event={event} onClose={() => setIsModalVisible(false)} />
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
        fontSize: 16,
        fontWeight: '600',
    },
});
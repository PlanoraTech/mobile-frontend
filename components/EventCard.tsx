import { getThemeStyles } from "@/assets/styles/themes";
import { useTheme } from "@/contexts/ThemeProvider";
import { useEffect, useState } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { EventModal } from "./EventModal";
import { useAuth } from "@/contexts/AuthProvider";
import { useInstitutionId } from "@/contexts/InstitutionIdProvider";

interface EventCardProps {
    event: DayEvent;
}

export interface DayEvent {
    id: string;
    title: string;
    date: Date;
}

const EventCard = ({ event }: EventCardProps) => {
    const { theme } = useTheme();
    const themeStyles = getThemeStyles(theme);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { institutionId } = useInstitutionId();
    const [title, setTitle] = useState(event.title);
    const { user } = useAuth()


    const handlePress = () => {
        const role = user?.institutions?.find(i => i.institutionId === institutionId)?.role;
        if (role === 'DIRECTOR') {
            setIsModalVisible(!isModalVisible);
        }
    };

    const handleClose = (newTitle: string) => {
        setTitle(newTitle);
        setIsModalVisible(false);
    };
    return (
        <Pressable
            onPress={handlePress}
            style={[styles.eventCard, themeStyles.content]}
        >
            <Text style={[styles.eventTitle, themeStyles.text]}>
                {title}
            </Text>
            <EventModal title={title} isVisible={isModalVisible} event={event} onClose={handleClose} />
        </Pressable>
    );
}

export default EventCard;

const styles = StyleSheet.create({
    eventCard: {
        justifyContent: 'center',
        padding: 15,
        marginHorizontal: 10,
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
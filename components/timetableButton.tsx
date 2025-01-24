import { SCREEN_WIDTH } from "@/constants";
import { Pressable, Text, StyleSheet } from "react-native";

interface TtButtonProps {
    choice: string;
    isActive: boolean;
    onPress: () => void;
}

export const TimetableButton = ({ choice, isActive, onPress }: TtButtonProps) => (
    <Pressable style={[styles.timetableButton, isActive && styles.activeButton]} onPress={onPress}>
        <Text style={[styles.buttonText, isActive && styles.activeButtonText]}>
            {choice}
        </Text>
    </Pressable>
);

const styles = StyleSheet.create({
    timetableButton: {
        paddingHorizontal: 5,
        paddingVertical: 15,
        width: SCREEN_WIDTH / 5,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeButton: {
        backgroundColor: '#0066cc',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666666',
    },
    activeButtonText: {
        color: 'white',
        fontWeight: '700',
    },
});
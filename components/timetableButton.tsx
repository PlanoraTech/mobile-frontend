import { SCREEN_WIDTH } from "@/constants";
import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeProvider";
import { getThemeStyles } from "@/assets/styles/themes";



interface TtButtonProps {
    choice: string;
    isActive: boolean;
    onPress: () => void;
}

export const TimetableButton = ({ choice, isActive, onPress }: TtButtonProps) => {
    const { theme } = useTheme();
    const themeStyles = getThemeStyles(theme);
    return (
        <Pressable style={[styles.timetableButton, isActive && themeStyles.button]} onPress={onPress}>
            <Text style={[styles.buttonText, themeStyles.textSecondary, isActive && styles.activeButtonText]}>
                {choice}
            </Text>
        </Pressable>

    );
};


const styles = StyleSheet.create({
    timetableButton: {
        paddingHorizontal: 5,
        paddingVertical: 15,
        width: SCREEN_WIDTH / 5,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',

    },
    activeButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
});
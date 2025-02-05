import { SCREEN_WIDTH } from "@/constants";
import { Pressable, Text, StyleSheet, Animated } from "react-native";
import { useTheme } from "@/contexts/ThemeProvider";
import { getThemeStyles } from "@/assets/styles/themes";
import { useEffect, useRef } from "react";
import { runButtonAnimation } from "@/utils/animationUtils";
interface TtButtonProps {
    choice: string;
    isActive: boolean;
    onPress: () => void;
}

export const TimetableButton = ({ choice, isActive, onPress }: TtButtonProps) => {
    const { theme } = useTheme();
    const themeStyles = getThemeStyles(theme);

    const backgroundAnim = useRef(new Animated.Value(0)).current;
    const textColorAnim = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        runButtonAnimation(backgroundAnim, textColorAnim, isActive);
    }, [isActive]);


    const backgroundColor = backgroundAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', themeStyles.button.backgroundColor]
    });

    const textColor = textColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [themeStyles.textSecondary.color, '#fff']
    });

    return (
        <Pressable onPress={onPress}>
            <Animated.View style={[
                styles.timetableButton,
                { backgroundColor }
            ]}>
                <Animated.Text style={[
                    styles.buttonText,
                    { color: textColor },
                    isActive && styles.activeButtonText
                ]}>
                    {choice}
                </Animated.Text>
            </Animated.View>
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
        fontWeight: '700',
    },
});
import { getThemeStyles } from "@/assets/styles/themes";
import { View, Text, StyleSheet, Animated, Easing, Dimensions, Pressable, Keyboard, useColorScheme } from 'react-native';
import { AlertCircle, ArrowLeft, Info } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { runSlideAnimation } from "@/utils/animationUtils";
import { useTheme } from "react-native-paper";

interface StatusMessageProps {
    message: string;
    type: 'error' | 'success';
    onClose?: () => void;
}

export const StatusMessage = ({
    message,
    onClose,
    type,
}: StatusMessageProps) => {
    const theme = useTheme();
    const slideAnimation = useRef(new Animated.Value(-Dimensions.get('window').width)).current;

    useEffect(() => {
        Keyboard.dismiss();
        runSlideAnimation(slideAnimation, 0, 300, Easing.out(Easing.ease));

        const timeout = setTimeout(() => {
            runSlideAnimation(slideAnimation, -Dimensions.get('window').width, 300, Easing.in(Easing.ease), () => onClose?.());
        }, 4000);

        return () => clearTimeout(timeout);
    }, [message]);

    const handleClose = () => {
        runSlideAnimation(slideAnimation, -Dimensions.get('window').width, 300, Easing.in(Easing.ease), () => onClose?.());
    }

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor: type === 'error' ? theme.colors.secondary : theme.colors.tertiary },
                { borderColor: theme.colors.outline },
                styles.absolute,

                {
                    transform: [{ translateX: slideAnimation }]
                }
            ]}
            accessible={true}
            accessibilityRole="alert"
            accessibilityLabel={`Status: ${message}`}
        >
            <View style={styles.iconContainer}>
                {type === 'success' ? (
                    <Info size={24} color={'#fff'} />) :
                    (
                        <AlertCircle
                            size={24}
                            color={'#fff'}
                        />)
                }
            </View>

            <Text style={[
                styles.message,
            ]}>
                {message}

            </Text>
            {onClose && (
                <Pressable
                    style={styles.closeButton}
                    onPress={handleClose}
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                >
                    <ArrowLeft size={18} color={'#f9f9f9'} />
                </Pressable>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginHorizontal: 16,
        borderRadius: 8,

    },
    absolute: {
        position: 'absolute',
        bottom: 5,
        left: 0,
        right: 0,
    },

    iconContainer: {
        marginRight: 12,
    },
    message: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        lineHeight: 24,

    },

    closeButton: {
        marginLeft: 12,
        padding: 8,
    },





});
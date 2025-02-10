import React, { useState, useRef } from 'react';
import { View, Pressable, Text, Animated, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { SCREEN_WIDTH } from '@/constants';
import { useTheme } from '@/contexts/ThemeProvider';
import { getThemeStyles } from '@/assets/styles/themes';


const ViewToggle = ({ onViewChange }: { onViewChange: (isAppointments: boolean) => void }) => {
    const [isAppointments, setIsAppointments] = useState(true);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const { theme } = useTheme();
    const themeStyles = getThemeStyles(theme);

    const toggleView = () => {
        const toValue = isAppointments ? 1 : 0;

        Animated.spring(slideAnim, {
            toValue,
            useNativeDriver: true,
            speed: 12,
            bounciness: 8,
        }).start();


        setIsAppointments(!isAppointments);
        onViewChange(!isAppointments);
    };

    const buttonWidth = SCREEN_WIDTH * 0.3;
    const slideX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, buttonWidth / 2],
    });

    return (
        <View style={styles.container}>
            <Pressable
                style={[styles.toggleContainer, { width: buttonWidth }, themeStyles.content]}
                onPress={toggleView}


            >
                <Animated.View
                    style={[
                        styles.slider,
                        themeStyles.button,
                        {
                            transform: [{ translateX: slideX }],
                            width: buttonWidth / 2,
                        },
                    ]}
                />
                <View style={styles.textContainer}>
                    <Text
                        style={[
                            styles.toggleText,
                            isAppointments ? styles.activeText : styles.inactiveText,
                        ]}
                    >
                        Órarend
                    </Text>
                    <Text
                        style={[
                            styles.toggleText,
                            !isAppointments ? styles.activeText : styles.inactiveText,
                        ]}
                    >
                        Esemény
                    </Text>
                </View>
            </Pressable>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    toggleContainer: {
        height: 30,
        borderRadius: 10,
        overflow: 'hidden',

    },
    slider: {
        position: 'absolute',
        height: '100%',
        borderRadius: 10,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',

    },
    toggleText: {
        fontSize: 12,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    activeText: {
        color: '#FFFFFF',
    },
    inactiveText: {
        color: '#8E8E93',
    },
});

export default ViewToggle;

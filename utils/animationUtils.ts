import { Animated, Easing, EasingFunction } from 'react-native';

export const runCloseAnimation = (
    slideAnim: Animated.Value,
    fadeAnim: Animated.Value,
    onComplete: () => void
) => {
    Animated.parallel([
        Animated.timing(slideAnim, {
            toValue: -1000,
            duration: 400,
            easing: Easing.bezier(0.4, 0.0, 1, 1),
            useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 400,
            easing: Easing.bezier(0.4, 0.0, 1, 1),
            useNativeDriver: true
        })
    ]).start(() => {
        onComplete();
    });
};

export const runOpenAnimation = (
    slideAnim: Animated.Value,
    fadeAnim: Animated.Value,
) => {
    Animated.parallel([
        Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 2,
            speed: 5,
            restSpeedThreshold: 100,
            restDisplacementThreshold: 40

        }),
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 350,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true
        })
    ]).start();
};

export const runButtonAnimation = (
    backgroundAnim: Animated.Value,
    textColorAnim: Animated.Value,
    isActive: boolean
) => {


    Animated.parallel([
        Animated.spring(backgroundAnim, {

            toValue: isActive ? 1 : 0,
            useNativeDriver: false,
            tension: 50,
            friction: 7,
        }),
        Animated.timing(textColorAnim, {
            toValue: isActive ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        })
    ]).start();
};

export const runSlideAnimation = (
    slideAnim: Animated.Value,
    toValue: number,
    duration: number,
    easing: EasingFunction,
    onComplete?: () => void
) => {
    Animated.timing(slideAnim, {
        toValue,

        duration,
        easing,
        useNativeDriver: true
    }).start(() => onComplete?.());
};


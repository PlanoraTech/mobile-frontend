import { Animated } from 'react-native';

export const runCloseAnimation = (
    slideAnim: Animated.Value,
    fadeAnim: Animated.Value,
    onComplete: () => void
) => {
    Animated.parallel([
        Animated.timing(slideAnim, {


            toValue: -1000,
            duration: 250,
            useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 250,
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
            tension: 65,
            friction: 11
        }),
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        })
    ]).start();
};


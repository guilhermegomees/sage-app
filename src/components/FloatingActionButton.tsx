import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, { withDelay, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
    duration: 1200,
    overshootClamping: true,
    dampingRatio: 0.8,
};

const OFFSET = 60;

type FloatingActionButtonProps = {
    isExpanded: Animated.SharedValue<boolean>;
    index: number;
    buttonLetter: string;
};

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ isExpanded, index, buttonLetter }) => {
    const animatedStyles = useAnimatedStyle(() => {
        const moveValue = isExpanded.value ? OFFSET * index : 0;
        const translateValue = withSpring(-moveValue, SPRING_CONFIG);
        const delay = index * 100;
        const scaleValue = isExpanded.value ? 1 : 0;

        return {
            transform: [
                { translateY: translateValue },
                { scale: withDelay(delay, withTiming(scaleValue)) },
            ],
        };
    });

    return (
        <AnimatedPressable style={[animatedStyles, styles.shadow, styles.button]}>
            <Animated.Text style={styles.content}>{buttonLetter}</Animated.Text>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        backgroundColor: '#82cab2',
        position: 'absolute',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -2,
    },
    shadow: {
        shadowColor: '#171717',
        shadowOffset: { width: -0.5, height: 3.5 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    content: {
        color: '#f8f9ff',
        fontWeight: '500',
    },
});

export default FloatingActionButton;
import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Pressable, TextStyle, ViewStyle } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import colors from '~/css/colors';

type MainFloatingButtonProps = {
    onPress: () => void;
    isExpanded: Animated.SharedValue<boolean>;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MainFloatingButton: React.FC<MainFloatingButtonProps> = ({ onPress, isExpanded }) => {
    const plusIconStyle = useAnimatedStyle(() => {
        const rotateValue = isExpanded.value ? '45deg' : '0deg';

        return {
            transform: [
                { rotate: withTiming(rotateValue) },
            ],
        };
    });

    return (
        <AnimatedPressable onPress={onPress} style={[styles.shadow, styles.button]}>
            <Animated.Text style={[plusIconStyle]}>
                <FontAwesome6 name="plus" size={24} color={colors.white} />
            </Animated.Text>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    button: {
        zIndex: 1,
        height: 60,
        width: 60,
        borderRadius: 100,
        backgroundColor: colors.blue_600,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shadow: {
        shadowColor: '#171717',
        shadowOffset: { width: -0.5, height: 3.5 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
});

export default MainFloatingButton;
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons, colors } from '~/imports';

interface PeriodSelectorProps {
    currentPeriod: string;
    onPrevPeriod: () => void;
    onNextPeriod: () => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ currentPeriod , onPrevPeriod, onNextPeriod }) => {
    return (
        <View style={styles.periodSelector}>
            <TouchableHighlight style={styles.arrow} onPress={onPrevPeriod} disabled={!currentPeriod} underlayColor={colors.gray_800}>
                <MaterialIcons name="chevron-left" size={28} color={colors.white_100} />
            </TouchableHighlight>
            <Text style={styles.currentPeriod}>{currentPeriod}</Text>
            <TouchableHighlight style={styles.arrow} onPress={onNextPeriod} underlayColor={colors.gray_800}>
                <MaterialIcons name="chevron-right" size={28} color={colors.white_100} />
            </TouchableHighlight>
        </View>
    );
};

const styles = StyleSheet.create({
    arrow: {
        padding: 10,
        borderRadius: 50,
    },
    periodSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        gap: 25
    },
    currentPeriod: {
        fontFamily: 'Outfit_500Medium',
        color: colors.white_100,
        fontSize: 16,
    },
});

export default PeriodSelector;
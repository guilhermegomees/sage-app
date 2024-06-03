import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { colors } from '~/imports';

interface PeriodSelectorProps {
    currentPeriod: string;
    onPrevPeriod: () => void;
    onNextPeriod: () => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ currentPeriod , onPrevPeriod, onNextPeriod }) => {
    return (
        <View style={styles.periodSelector}>
            <Button title="Anterior" onPress={onPrevPeriod} disabled={!currentPeriod} />
            <Text style={styles.currentPeriod}>{currentPeriod}</Text>
            <Button title="Próximo" onPress={onNextPeriod} />
        </View>
    );
};

const styles = StyleSheet.create({
    periodSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    currentPeriod: {
        color: colors.white_100,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PeriodSelector;
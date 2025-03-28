import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { monthsList } from '~/constants/monthsList';
import base from '~/css/base';
import colors from '~/css/colors';
import { charts } from '~/enums/enums';

interface PeriodSelectorProps {
    currentPeriod: string;
    currentYear?: number;
    onPrevPeriod: () => void;
    onNextPeriod: () => void;
    chart?: charts;
}

const getAdjacentMonths = (currentPeriod: string) => {
    const [currentMonth] = currentPeriod.split(' ');
    const currentIndex = monthsList.indexOf(currentMonth);

    const prevMonth = monthsList[(currentIndex - 1 + monthsList.length) % monthsList.length];
    const nextMonth = monthsList[(currentIndex + 1) % monthsList.length];

    return { prevMonth, nextMonth };
};

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ currentPeriod, currentYear, onPrevPeriod, onNextPeriod, chart }) => {
    const { prevMonth, nextMonth } = getAdjacentMonths(currentPeriod);

    const renderLeftContent = () => {
        if (chart === charts.bar) {
            return <MaterialIcons name="chevron-left" size={28} color={colors.gray_50} />;
        } else if (chart === charts.pie) {
            return <Text style={styles.month}>{prevMonth}</Text>;
        } else {
            return <MaterialIcons name="chevron-left" size={28} color={colors.gray_50} />
        }
    };

    const renderRightContent = () => {
        if (chart === charts.bar) {
            return <MaterialIcons name="chevron-right" size={28} color={colors.gray_50} />;
        } else if (chart === charts.pie) {
            return <Text style={styles.month}>{nextMonth}</Text>;
        } else {
            return <MaterialIcons name="chevron-right" size={28} color={colors.gray_50} />
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.periodSelector]}>
                <TouchableOpacity onPress={onPrevPeriod} style={[base.me_35]}>
                    {renderLeftContent()}
                </TouchableOpacity>
                <Text
                    style={[
                        styles.currentPeriod,
                        { width: chart === charts.pie ? 100 : 200 },
                        { fontSize: chart === charts.pie ? 20 : 18 }
                    ]}>
                    {currentPeriod}
                </Text>
                <TouchableOpacity onPress={onNextPeriod} style={[base.ms_35]}>
                    {renderRightContent()}
                </TouchableOpacity>
            </View>
            {(chart === charts.pie || !chart) && (
                <Text style={styles.currentYear}>{currentYear}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    currentYear: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.white,
        fontSize: 14,
        marginBottom: 10,
    },
    periodSelector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    currentPeriod: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.white,
        textAlign: 'center',
        height: 20
    },
    month: {
        color: colors.gray_100,
        fontFamily: 'Outfit_500Medium',
        fontSize: 15,
        opacity: 0.7,
        textAlign: 'center',
        width: 90,
        height: 20,
    },
});

export default PeriodSelector;
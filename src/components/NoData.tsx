import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import base from '~/css/base';
import colors from '~/css/colors';

interface NoDataProps {
    title: string;
    subTitle?: string;
    buttonText?: string;
    buttonAction?: () => void;
}

const NoData: React.FC<NoDataProps> = ({
    title,
    subTitle,
    buttonText,
    buttonAction
}) => {
    return (
        <View style={[base.flex_1, base.alignItemsCenter, base.justifyContentCenter, base.px_20, base.gap_20]}>
            <View style={[base.gap_10]}>
                <Text style={[styles.noDataTitle]}>{title}</Text>
                <Text style={[styles.noDataSubtitle]}>{subTitle}</Text>
            </View>
            {buttonText && buttonAction && (
                <TouchableOpacity style={[base.button, { borderRadius: 30 }]} onPress={buttonAction}>
                    <Text style={[base.btnText]}>{buttonText}</Text>
                </TouchableOpacity>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    noDataTitle: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 18,
        height: 18,
        color: colors.gray_150,
        textAlign: 'center',
    },
    noDataSubtitle: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        color: colors.gray_200,
        textAlign: 'center',
    }
});

export default NoData;
// src/components/Header.tsx
import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '~/imports';
import colors from '~/css/colors';
import { base } from '~/imports';

export default function Header() {
    return (
        <View style={[base.flexRow, base.flexSpaceBetween, base.alignItemsCenter, base.px_30, styles.container]}>
            <View style={[base.flexRow, base.alignItemsCenter, base.gap_12,]}>
                <Image source={require('./../assets/images/user-circle.png')} style={styles.iconUser} />
                <View style={[base.gap_4]}>
                    <Text style={styles.text}>[Nome]</Text>
                </View>
            </View>
            <View style={[base.flexRow, base.gap_20]}>
                <MaterialIcons name='visibility' size={28} color={colors.gray_50} />
                <TouchableOpacity >
                    <MaterialIcons name='add' size={28} color={colors.gray_50} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
        paddingTop: 25,
    },
    text: {
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_50,
        fontSize: 14,
        lineHeight: 20,
    },
    iconUser: {
        width: 40,
        height: 40,
    },
});

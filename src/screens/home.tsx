import { StyleSheet, View, Text, SafeAreaView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { base } from "../css/base";
import { colors } from '../css/colors';
import React from 'react';
import Tabs from '~/navigation/HomeTabNavigator';

export default function Home() {
    return (
        <SafeAreaView style={[styles.container, base.flex_1]}>
            <View style={[base.flex_1]}>
                <View style={[base.flexRow, base.flexSpaceBetween, base.alignItemsCenter, base.pb_15, base.px_30]}>
                    <View style={[base.flexRow, base.alignItemsCenter, base.gap_12,]}>
                        <Image source={require('./../assets/images/user-circle.png')} style={styles.iconUser} />
                        <View style={[base.gap_4]}>
                            <Text style={styles.text}>[Nome]</Text>
                        </View>
                    </View>
                    <View style={[base.flexRow, base.gap_20]}>
                        <MaterialIcons name='visibility' size={28} color={colors.gray_50} />
                        <MaterialIcons name='add' size={28} color={colors.gray_50} />
                    </View>
                </View>
                <Tabs />
            </View>
        </SafeAreaView>
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
    containerUser: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: colors.gray_800,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconUser: {
        width: 40,
        height: 40
    }
})
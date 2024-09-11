// src/components/Header.tsx
import React, { useContext } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, useNavigation } from '~/imports';
import colors from '~/css/colors';
import { base } from '~/imports';
import { StackNavigationProp } from '@react-navigation/stack';
import { HeaderContext } from '~/context/HeaderContext';

type HeaderScreenNavigationProp = StackNavigationProp<any, 'Header'>;

export default function Header() {
    const navigation = useNavigation<HeaderScreenNavigationProp>();

    const { showValues, setShowValues } = useContext(HeaderContext);

    const handleNavigateToNewTransaction = () => {
        navigation.navigate('NewTransaction');
    };

    const toggleShowValues = () => {
        setShowValues(!showValues);
    }

    return (
        <View style={[base.flexRow, base.flexSpaceBetween, base.alignItemsCenter, base.px_30, styles.container]}>
            <View style={[base.flexRow, base.alignItemsCenter, base.gap_12,]}>
                <View style={[base.gap_4]}>
                    <Text style={styles.text}>Olá [Nome]</Text>
                </View>
            </View>
            <View style={[base.flexRow, base.gap_20]}>
                <TouchableOpacity onPress={toggleShowValues}>
                    <MaterialIcons
                        name={showValues ? 'visibility' : 'visibility-off'}
                        size={28}
                        color={colors.gray_50} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNavigateToNewTransaction}>
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
        fontSize: 16,
        lineHeight: 20,
    },
    iconUser: {
        width: 40,
        height: 40,
    },
});

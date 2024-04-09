import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    colors,
    base,
    Image,
    MaterialIcons,
    useNavigation,
    StackNavigationProp
} from '~/imports';

type TransactionsScreenNavigationProp = StackNavigationProp<any, 'Transactions'>;

export default function Transactions() {
    const navigation = useNavigation<TransactionsScreenNavigationProp>();

    const handleNavigateToBack = () => {
        navigation.navigate('Home');
    };

    return (
        <View style={[styles.container]}>
            <View style={[styles.containerBack]}>
                <TouchableOpacity onPress={handleNavigateToBack}>
                    <MaterialIcons name="chevron-left" size={30} color={colors.white_100} />
                </TouchableOpacity>
                <Text style={[styles.titleTransactions]}>Transações</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray_900,
        paddingHorizontal: 20
    },
    containerBack: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 25,
    },
    titleTransactions: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.white_100,
        fontSize: 20,
        marginLeft: 10,
    },
})
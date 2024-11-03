import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import BottomSheet from '~/components/BottomSheet';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { TypeScreem } from '~/enums/enums';
import colors from '~/css/colors';
import base from '~/css/base';
import { useTransactions } from '~/context/TransactionContext';
import { FontAwesome6 } from '@expo/vector-icons';
import { ICreditCard } from '~/interfaces/interfaces';

type CreditCardScreenNavigationProp = StackNavigationProp<any, 'CreditCard'>;
type CreditCardScreenRouteProp = RouteProp<StackParamList, 'CreditCard'>;

type StackParamList = {
    CreditCard: { creditCard: ICreditCard };
};

export default function CreditCard() {
    const navigation = useNavigation<CreditCardScreenNavigationProp>();
    const { transactions } = useTransactions();
    const route = useRoute<CreditCardScreenRouteProp>();
    const { creditCard } = route.params || {};

    // Filtra as transações onde source == 2
    const filteredTransactions = transactions.filter(transaction => transaction.source === 2);

    const handleNavigateToCardDatails = () => {
        navigation.navigate('CardDetails');
    };

    const handleNavigateToBack = () => {
        navigation.goBack();
    }

    return (
        <View style={[styles.container, base.alignItemsCenter, base.flex_1]}>
            <View style={styles.backContainer}>
                <TouchableOpacity onPress={handleNavigateToBack} style={styles.iconBack}>
                    <FontAwesome6 name="angle-left" size={20} color={colors.gray_50} />
                </TouchableOpacity>
            </View>
            {/* Card */}
            <View style={[styles.card]}>
                <View style={[base.p_13, base.flexColumn, base.flexSpaceBetween, base.flex_1]}>
                    <View style={[styles.containerTop]}>
                        <Text style={[styles.cardName]}>{creditCard.name}</Text>
                        <Image source={require('./../assets/images/contactless.png')} style={styles.contactless} />
                    </View>
                    <View style={[styles.containerChip]}>
                        <Image source={require('./../assets/images/chipcard.png')} style={styles.chipcard} />
                    </View>
                    <View style={[styles.containerBottom]}>
                        <Text style={[styles.sage]}>Sage</Text>
                    </View>
                </View>
            </View>
            {/* Botões de ação */}
            <View style={[base.flexRow, base.alignItemsCenter, base.justifyContentCenter, base.gap_25, base.my_25]}>
                <View style={[base.alignItemsCenter, base.justifyContentCenter, base.gap_8]}>
                    <TouchableOpacity>
                        <View style={[styles.buttonsActions]}>
                            <Image source={require('./../assets/images/card-recive.png')} style={styles.iconButtonAction} />
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.textBtnsActions]}>Despesa cartão</Text>
                </View>
                <View style={[base.alignItemsCenter, base.justifyContentCenter, base.gap_8]}>
                    <TouchableOpacity onPress={handleNavigateToCardDatails}>
                        <View style={[styles.buttonsActions]}>
                            <FontAwesome6 name="pen" color={colors.gray_100} size={20}/>
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.textBtnsActions]}>Editar</Text>
                </View>
            </View>
            {/* Painel de transações */}
            <BottomSheet data={filteredTransactions} type={TypeScreem.Card} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
    },
    backContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        gap: 10,
        padding: 30,
    },
    iconBack: {
        justifyContent: "center",
        width: 30,
        height: 30,
    },
    screenTitle: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.gray_50,
        fontSize: 22,
        height: 22
    },
    card: {
        width: 288,
        height: 178,
        backgroundColor: '#E0E3E7',
        borderRadius: 20
    },
    contactless: {
        width: 28,
        height: 28,
        marginRight: 1
    },
    cardName: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 20,
        color: colors.gray_900,
        marginTop: 5
    },
    sage: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 20,
        color: colors.gray_900,
        lineHeight: 20,
        marginBottom: 5
    },
    chipcard: {
        width: 40,
        height: 29
    },
    containerChip: {
        marginLeft: 10,
    },
    containerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerBottom: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    buttonsActions: {
        backgroundColor: colors.gray_800,
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textBtnsActions: {
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_400,
        fontSize: 14,
        lineHeight: 22
    },
    iconButtonAction: {
        width: 30,
        height: 30
    },
    iconButtonActionEdit: {
        width: 22,
        height: 22
    },
    dueDate: {
        color: colors.gray_50,
        fontWeight: '500',
        fontSize: 20,
        lineHeight: 24
    },
    dueMonth: {
        color: colors.gray_400,
        fontWeight: '400',
        fontSize: 11,
        lineHeight: 12
    }
})

import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { colors } from '../css/colors';
import { base } from '../css/base';

import { ITransaction } from '~/interfaces';
import { TypeScreem } from '~/enums';

import BottomSheet from '~/components/BottomSheet';

type CardsScreenNavigationProp = StackNavigationProp<any, 'Cards'>;

export default function Cards() {
    const navigation = useNavigation<CardsScreenNavigationProp>();
    const [transactions, setTransactions] = useState<ITransaction[]>([]);

    //TODO: Trazer transações do cartão através do banco e popular o data
    const data: ITransaction[] = [
        { id: 1, date: "2024-03-04T03:00:00.000Z", description: "Compra em supermercado", icon: "shopping-cart", isExpense: 1, value: 151.75, wallet: 1 },
        { id: 2, date: "2024-03-04T03:00:00.000Z", description: "Pagamento de conta de luz", icon: "bolt", isExpense: 1, value: 80.50, wallet: 1 },
        { id: 3, date: "2024-03-08T03:00:00.000Z", description: "Jantar em restaurante", icon: "utensils", isExpense: 1, value: 65.30, wallet: 1 },
        { id: 4, date: "2024-03-10T03:00:00.000Z", description: "Compra online", icon: "shopping-bag", isExpense: 1, value: 200.00, wallet: 1 },
        { id: 5, date: "2024-03-12T03:00:00.000Z", description: "Pagamento de fatura", icon: "credit-card", isExpense: 1, value: 600.00, wallet: 1 },
        { id: 6, date: "2024-03-12T03:00:00.000Z", description: "Reembolso de compra", icon: "money-check-alt", isExpense: 0, value: 50.00, wallet: 1 },
        { id: 7, date: "2024-03-12T03:00:00.000Z", description: "Compra em loja de roupas", icon: "tshirt", isExpense: 1, value: 120.00, wallet: 1 },
        { id: 8, date: "2024-03-15T03:00:00.000Z", description: "Assinatura de serviço online", icon: "star", isExpense: 1, value: 15.99, wallet: 1 }
    ];

    useEffect(() => {
        setTransactions(data);
    }, []);

    const handleNavigateToCardDatails = () => {
        navigation.navigate('CardDetails');
    };

    return (
        <View style={[styles.container, base.alignItemsCenter, base.flex_1]}>
            {/* Card */}
            <View style={[styles.card]}>
                <View style={[base.p_13, base.flexColumn, base.flexSpaceBetween, base.flex_1]}>
                    <View style={[styles.containerTop]}>
                        <Text style={[styles.cardName]}>Cartão 1</Text>
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
                    <Text style={[styles.textBtnsActions]}>Transação</Text>
                </View>
                <View style={[base.alignItemsCenter, base.justifyContentCenter, base.gap_8]}>
                    <TouchableOpacity onPress={handleNavigateToCardDatails}>
                        <View style={[styles.buttonsActions]}>
                            <Image source={require('./../assets/images/edit.png')} style={styles.iconButtonActionEdit} />
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.textBtnsActions]}>Editar</Text>
                </View>
                <View style={[base.alignItemsCenter, base.justifyContentCenter, base.gap_8]}>
                    <TouchableOpacity>
                        <View style={[styles.buttonsActions]}>
                            <View style={[base.flexColumn, base.alignItemsCenter]}>
                                {/* TODO: Aplicar data de vencimento definida no cartão e implementar
                                função para mostrar um mês em diante depois do dia definido */}
                                <Text style={[styles.dueDate]}>10</Text>
                                <Text style={[styles.dueMonth]}>Abr</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.textBtnsActions]}>Vencimento</Text>
                </View>
            </View>
            {/* Painel de transações */}
            <BottomSheet data={transactions} type={TypeScreem.Card} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
        paddingTop: 25
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

import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import BottomSheet from '~/components/BottomSheet';
import Header from '~/components/Header';
import { HeaderContext } from '~/context/HeaderContext';
import base from '~/css/base';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import colors from '~/css/colors';
import FloatingButton from '~/components/FloatingButton';
import { useTransactions } from '~/context/TransactionContext';
import useUser from '~/hooks/useUser';
import { IAccount, ICreditCard } from '~/interfaces/interfaces';
import { formatValue, getBankLogo } from '~/utils/utils';
import { useAccounts } from '~/context/AccountContext';
import { useCreditCards } from '~/context/CreditCardContext';

export default function Home() {
    const { showValues } = useContext(HeaderContext);
    const { transactions, fetchTransactions } = useTransactions();
    const { accounts, totalValue, totalValueWithoutFilter, fetchAccounts } = useAccounts();
    const { creditCards, fetchCreditCards } = useCreditCards();
    const user = useUser();

    useEffect(() => {
        if (user) {
            fetchTransactions(user);
            fetchAccounts(user);
            fetchCreditCards(user);
        }
    }, [user]);

    // Calcular despesas e receitas
    const { totalExpenses, totalIncome } = transactions.reduce((totals, item) => {
        if (!item.creditCard){
            if (item.isExpense) {
                totals.totalExpenses += item.value;
            } else {
                totals.totalIncome += item.value;
            }
        }
        return totals;
    }, { totalExpenses: 0, totalIncome: 0 });

    return (
        <>
            <Header />
            <ScrollView style={[base.flex_1, { backgroundColor: colors.gray_900 }]}>
                <View style={[styles.container]}>
                    <View style={[base.flexColumn, base.alignItemsCenter, base.justifyContentCenter, base.gap_8, base.mb_10]}>
                        <Text style={[styles.valueBalance, styles.remainder, !showValues && styles.hideValues]}>R$ {formatValue(totalValue)}</Text>
                        <View style={[base.alignItemsCenter, base.justifyContentCenter, base.flexRow, base.gap_15]}>
                            <View style={[base.flexRow, base.alignItemsCenter, base.justifyContentCenter, base.gap_5]}>
                                <FontAwesome6 name='caret-up' color={colors.green_500} size={20} />
                                <Text style={[styles.valueBalance, styles.entrance, !showValues && styles.hideValues, styles.shortText]}>R$ {formatValue(totalIncome)}</Text>
                            </View>
                            <View style={[base.flexRow, base.alignItemsCenter, base.justifyContentCenter, base.gap_5]}>
                                <FontAwesome6 name='caret-down' color={colors.red_500} size={20} />
                                <Text style={[styles.valueBalance, styles.exits, !showValues && styles.hideValues, styles.shortText]}>R$ {formatValue(totalExpenses)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.accounts]}>
                        <View style={[styles.lineBottom, base.mb_15, base.pb_15]}>
                            <Text style={[styles.title]}>Contas</Text>
                        </View>
                        <View style={[base.gap_20]}>
                            {accounts.map((account: IAccount)=>{
                                return (
                                    <View key={account.id} style={[styles.account]}>
                                        <Image source={getBankLogo(account.bankName)} style={[styles.accountIcon]}/>
                                        <View style={[base.gap_5]}>
                                            <Text style={[styles.accountText]}>{account.name}</Text>
                                            <Text style={[styles.accountValue, { color: account.balance < 0 ? colors.red_500 : colors.green_500 }]}>R$ {formatValue(account.balance)}</Text>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                        <View style={[styles.lineTop, base.mt_15, base.pt_15, base.flexRow, base.justifyContentSpaceBetween]}>
                            <Text style={[styles.title]}>Total</Text>
                            <Text style={[styles.title]}>R$ {formatValue(totalValueWithoutFilter)}</Text>
                        </View>
                    </View>
                    <View style={[styles.cards]}>
                        <View style={[styles.lineBottom, base.mb_15, base.pb_15]}>
                            <Text style={[styles.title]}>Cartões</Text>
                        </View>
                        <View style={[base.gap_20]}>
                            {creditCards.length > 0 ?
                                creditCards.map((creditCard: ICreditCard)=>{
                                // Calcule o valor da fatura atual
                                const currentInvoice = creditCard.invoices.find(invoice => !invoice.isPaid);
                                const invoiceValue = formatValue(currentInvoice ? currentInvoice.totalAmount : 0);

                                // Verifique a data atual em relação à data de fechamento
                                const today = new Date();
                                const closingDate = new Date(today.getFullYear(), today.getMonth() + 1, creditCard.closingDay);
                                const isClosed = today > closingDate;
                                
                                return (
                                    <View key={creditCard.id} style={[styles.card]}>
                                        <View style={[base.flexRow, base.justifyContentSpaceBetween, base.alignItemsCenter]}>
                                            <Image source={getBankLogo(creditCard.bankName)} style={[styles.cardIcon]} />
                                            <FontAwesome6 name="angle-right" size={15} color={colors.gray_200} />
                                        </View>
                                        <View style={[base.gap_5]}>
                                            <View style={[base.flexRow, base.justifyContentSpaceBetween]}>
                                                <Text style={[styles.cardText]}>{creditCard.name}</Text>
                                                <Text style={[styles.cardValue]}>R$ {invoiceValue}</Text>
                                            </View>
                                            <View style={[base.w_100, base.justifyContentEnd, base.alignItemsCenter, base.gap_4, base.flexRow]}>
                                                <MaterialIcons name={'circle'} color={isClosed ? colors.red_500 : colors.blue_300} size={7} />
                                                <Text style={[styles.invoiceStatus, { color: isClosed ? colors.red_500 : colors.blue_300 }]}>
                                                    {isClosed ? "Fechada" : "Aberta"}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }) : 
                            <View style={[base.flexColumn, base.alignItemsCenter, base.gap_10, base.my_10]}>
                                    <Image source={require('../assets/images/no-credit-card.png')} tintColor={colors.gray_100} style={[styles.noCreditCardIcon]} />
                                <Text style={[styles.emptyCard]}>Você ainda não possui nenhum cartão cadastrado</Text>
                            </View>}
                        </View>
                    </View>
                    {/* Painel de transações */}
                    {/* <BottomSheet data={transactions} type={TypeScreem.Account} /> */}
                </View>
            </ScrollView>
            <FloatingButton/>
        </>
    );
}

const styles = StyleSheet.create({
    modalExit: {
        backgroundColor: colors.gray_800,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        width: "100%",
        height: "20%",
        alignItems: "center",
    },
    container: {
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 5,
        gap: 25
    },
    entrance: {
        color: colors.green_500,
    },
    exits: {
        color: colors.red_500,
    },
    remainder: {
        color: colors.gray_100,
        fontSize: 35,
    },
    valueBalance: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 18,
    },
    buttonsActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    buttonAction: {
        width: 77,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    button: {
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
    panelTransactions: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.gray_800,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    linePanelTransactions: {
        width: 40,
        height: 5,
        backgroundColor: colors.gray_900,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 15,
        borderRadius: 87,
    },
    latestTransactions: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.gray_50
    },
    date: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.gray_50
    },
    containerIconTransactions: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 27,
        height: 27,
        borderRadius: 7
    },
    containerTrasactions: {
        borderRadius: 15,
        backgroundColor: colors.gray_850,
        marginTop: 10
    },
    textTransaction: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.gray_50
    },
    valueTransaction: {
        fontSize: 12,
        fontWeight: '500',
    },
    divisor: {
        width: 324,
        height: 1,
        backgroundColor: colors.gray_700
    },
    iconButtonAction: {
        width: 29,
        height: 29
    },
    iconBalanceButtonAction: {
        width: 28,
        height: 26
    },
    shortText: {
        textShadowRadius: 20,
    },
    hideValues: {
        textShadowColor: colors.gray_700,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 40,
        backgroundColor: colors.gray_600,
        borderRadius: 5,
        color: 'transparent'
    },
    accounts: {
        backgroundColor: colors.gray_800,
        width: '100%',
        padding: 20,
        borderRadius: 15
    },
    title: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 17,
        color: colors.gray_50
    },
    account: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    accountIcon: {
        borderRadius: 50,
        width: 40,
        height: 40
    },
    accountText: {
        fontFamily: "Outfit_500Medium",
        fontSize: 17,
        color: colors.gray_50
    },
    accountValue: {
        fontFamily: "Outfit_500Medium",
        fontSize: 14,
        color: colors.gray_50
    },
    lineBottom: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray_700,
    },
    lineTop: {
        borderTopWidth: 1,
        borderTopColor: colors.gray_700,
    },
    invoiceStatus: {
        fontFamily: "Outfit_500Medium",
        fontSize: 14
    },
    cards: {
        backgroundColor: colors.gray_800,
        width: '100%',
        padding: 20,
        borderRadius: 15
    },
    card: {
        gap: 15,
        backgroundColor: colors.gray_875,
        padding: 20,
        borderRadius: 15
    },
    cardIcon: {
        borderRadius: 50,
        width: 40,
        height: 40
    },
    cardText: {
        fontFamily: "Outfit_500Medium",
        fontSize: 15,
        color: colors.gray_50
    },
    cardValue: {
        fontFamily: "Outfit_500Medium",
        fontSize: 15,
        color: colors.gray_50
    },
    emptyCard: {
        fontFamily: "Outfit_500Medium",
        fontSize: 16,
        color: colors.gray_100,
    },
    noCreditCardIcon: {
        width: 60,
        height: 60
    }
})

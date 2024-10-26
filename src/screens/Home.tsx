import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import BottomSheet from '~/components/BottomSheet';
import Header from '~/components/Header';
import { HeaderContext } from '~/context/HeaderContext';
import base from '~/css/base';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import colors from '~/css/colors';
import { TypeScreem } from '~/enums/enums';
import FloatingButton from '~/components/FloatingButton';
import { useTransactions } from '~/context/TransactionContext';
import useUser from '~/hooks/useUser';
import { IAccount, IUser } from '~/interfaces/interfaces';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '~/config/firebase';
import { banks } from '~/constants/banks';
import { getBankLogo } from '~/utils/utils';

// Formatar valores com duas casas decimais
function formatValue(value: number): string {
    return value.toFixed(2).replace('.', ',');
}

export default function Home() {
    const { showValues } = useContext(HeaderContext);
    const { transactions, fetchTransactions } = useTransactions();
    const user = useUser();

    const [accounts, setAccounts] = useState<IAccount[]>([]);
    const accountCollectionRef = collection(db, "account");

    const [formattedTotalValueAccounts, setFormattedTotalValueAccounts] = useState<string>('0,00');
    const [totalValueAccounts, setTotalValueAccounts] = useState<number>(0);

    const fetchAccounts = async (user: IUser): Promise<void> => {
        try {
            const q = query(accountCollectionRef, where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const data: IAccount[] = querySnapshot.docs.map(doc => {
                const accountData = doc.data();
                return {
                    id: doc.id,
                    uid: accountData.uid,
                    name: accountData.name,
                    bankName: accountData.bankName,
                    value: accountData.value,
                    includeInSum: accountData.includeInSum
                };
            });

            // Filtra as contas que devem ser incluídas no total e soma seus valores
            const totalValue = data
                .filter(account => account.includeInSum)
                .reduce((acc, account) => {
                    const numericValue = parseFloat(account.value.replace(',', '.'));
                    return acc + numericValue;
                }, 0);

            // Formata o valor total com duas casas decimais e vírgula como separador decimal
            const formattedTotalValue = totalValue.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });

            setTotalValueAccounts(totalValue);
            setFormattedTotalValueAccounts(formattedTotalValue);
            setAccounts(data);
        } catch (error) {
            console.error("Erro ao buscar contas: ", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTransactions(user);
            fetchAccounts(user);
        }
    }, [user]);

    // Calcular total de despesas e receitas
    const { totalExpenses, totalIncome } = transactions.reduce((totals, item) => {
        if (item.isExpense) {
            totals.totalExpenses += item.value;
        } else {
            totals.totalIncome += item.value;
        }
        return totals;
    }, { totalExpenses: 0, totalIncome: 0 });

    // Calcular saldo final
    const remainder = totalIncome - totalExpenses + totalValueAccounts;

    return (
        <>
            <Header />
            <ScrollView style={[base.flex_1]}>
                <View style={[styles.container, base.flex_1, base.alignItemsCenter, base.pt_5, base.gap_25, base.pb_90]}>
                    <View style={[base.flexColumn, base.alignItemsCenter, base.justifyContentCenter, base.gap_8, base.mb_10]}>
                        <Text style={[styles.valueBalance, styles.remainder, !showValues && styles.hideValues]}>R$ {formatValue(remainder)}</Text>
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
                                            <Text style={[styles.accountValue, {color: parseFloat(account.value) < 0 ? colors.red_500 : colors.green_500}]}>R$ {account.value}</Text>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                        <View style={[styles.lineTop, base.mt_15, base.pt_15, base.flexRow, base.justifyContentSpaceBetween]}>
                            <Text style={[styles.title]}>Total</Text>
                            <Text style={[styles.title]}>R$ {formattedTotalValueAccounts}</Text>
                        </View>
                    </View>
                    <View style={[styles.cards]}>
                        <View style={[styles.lineBottom, base.mb_15, base.pb_15]}>
                            <Text style={[styles.title]}>Cartões</Text>
                        </View>
                        <View style={[base.gap_20]}>
                            <View style={[styles.card]}>
                                <View style={[base.flexRow, base.justifyContentSpaceBetween, base.alignItemsCenter]}>
                                    <Image source={getBankLogo("Santander")} style={[styles.cardIcon]} />
                                    <FontAwesome6 name="angle-right" size={15} color={colors.gray_200} />
                                </View>
                                <View style={[base.gap_5]}>
                                    <View style={[base.flexRow, base.justifyContentSpaceBetween]}>
                                        <Text style={[styles.cardText]}>Santander</Text>
                                        <Text style={[styles.cardValue]}>R$ 0,00</Text>
                                    </View>
                                    <View style={[base.w_100, base.justifyContentEnd, base.alignItemsCenter, base.gap_4, base.flexRow]}>
                                        <MaterialIcons name={'circle'} color={colors.blue_300} size={7} />
                                        <Text style={[styles.invoiceStatus, { color: colors.blue_300 }]}>Aberta</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* Painel de transações */}
                    <BottomSheet data={transactions} type={TypeScreem.Account} />
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
        backgroundColor: colors.gray_900,
        paddingHorizontal: 15
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
})

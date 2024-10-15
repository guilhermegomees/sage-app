import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import BottomSheet from '~/components/BottomSheet';
import Header from '~/components/Header';
import { HeaderContext } from '~/context/HeaderContext';
import base from '~/css/base';
import { FontAwesome6 } from '@expo/vector-icons';
import colors from '~/css/colors';
import { TypeScreem } from '~/enums/enums';
import FloatingButton from '~/components/FloatingButton';
import { useTransactions } from '~/context/TransactionContext';
import useUser from '~/hooks/useUser';

// Formatar valores com duas casas decimais
function formatValue(value: number): string {
    const valueStr = value.toFixed(2).replace('.', ',');

    if (value < 0) {
        return `- R$ ${Math.abs(value).toFixed(2).replace('.', ',')}`;
    }

    return `R$ ${valueStr}`;
}

export default function Home() {
    const { showValues } = useContext(HeaderContext);
    const { transactions, fetchTransactions } = useTransactions();
    const user = useUser();

    // Carregar transações somente quando user estiver disponível
    useEffect(() => {
        if(user) fetchTransactions(user);
    }, [user]);

    // TODO: Calcular o total de entradas e saídas para a wallet específica
    let totalExpenses = 0;
    let totalIncome = 0;

    for (const item of transactions) {
        if (item.isExpense) {
            totalExpenses += item.value;
        } else {
            totalIncome += item.value;
        }
    }

    return (
        <>
            <Header />
            <View style={[styles.container, base.flex_1, base.alignItemsCenter, base.pt_10, base.gap_10]}>
                {/* Conta */}
                <View style={[base.flexRow, base.alignItemsCenter, base.justifyContentCenter, base.gap_8]}>
                    {/* TODO: Aplicar nome da carteira vindo do data */}
                    <Text style={[styles.textWallet]}>[Wallet]</Text>
                    <View style={[styles.containerRetweet, base.alignItemsCenter, base.justifyContentCenter]}>
                        <FontAwesome6 name='repeat' color={colors.white} size={12} />
                    </View>
                </View>
                {/* Valores */}
                <View style={[base.flexColumn, base.alignItemsCenter, base.justifyContentCenter, base.gap_8, base.mb_10]}>
                    {/* TODO: Aplicar valor da conta vindo do data */}
                    <Text style={[styles.textValue, !showValues && styles.hideValues]}> {formatValue(totalIncome - totalExpenses)} </Text>
                    <View style={[base.alignItemsCenter, base.justifyContentCenter, base.flexRow, base.gap_15]}>
                        <View style={[base.flexRow, base.alignItemsCenter, base.justifyContentCenter, base.gap_5]}>
                            <FontAwesome6 name='caret-up' color={colors.green_500} size={20} />
                            <Text style={[styles.textValueEntrance, !showValues && styles.hideValues, styles.shortText]}>{formatValue(totalIncome)}</Text>
                        </View>
                        <View style={[base.flexRow, base.alignItemsCenter, base.justifyContentCenter, base.gap_5]}>
                            <FontAwesome6 name='caret-down' color={colors.red_500} size={20} />
                            <Text style={[styles.textValueOutPut, !showValues && styles.hideValues, styles.shortText]}>{formatValue(totalExpenses)}</Text>
                        </View>
                    </View>
                </View>
                {/* Botões de ação */}
                {/* <View style={[styles.buttonsActionsContainer]}>
                    <View style={[styles.buttonAction]}>
                        <TouchableOpacity onPress={handleNavigateToNewTransaction}>
                            <View style={[styles.button]}>
                                <Image source={require('./../assets/images/dolar.png')} style={styles.iconButtonAction} />
                            </View>
                        </TouchableOpacity>
                        <Text style={[styles.textBtnsActions]}>Registrar</Text>
                    </View>
                    <View style={[styles.buttonAction]}>
                        <TouchableOpacity>
                            <View style={[styles.button]}>
                                <Image source={require('./../assets/images/balance.png')} style={[styles.iconBalanceButtonAction]} />
                            </View>
                        </TouchableOpacity>
                        <Text style={[styles.textBtnsActions]}>Balancear</Text>
                    </View>
                </View> */}
                {/* Painel de transações */}
                <BottomSheet data={transactions} type={TypeScreem.Account} />
            </View>
            <FloatingButton/>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
    },
    textWallet: {
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_400,
        fontSize: 16,
        lineHeight: 22
    },
    containerRetweet: {
        backgroundColor: colors.gray_800,
        borderRadius: 3,
        width: 18,
        height: 14
    },
    textValue: {
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_100,
        fontSize: 40,
    },
    textValueEntrance: {
        fontFamily: 'Outfit_500Medium',
        color: colors.green_500,
        fontSize: 14,
        lineHeight: 22
    },
    textValueOutPut: {
        fontFamily: 'Outfit_500Medium',
        color: colors.red_500,
        fontSize: 14,
        lineHeight: 22
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
    line: {
        width: 207,
        height: 3,
        backgroundColor: colors.gray_850,
        borderRadius: 100
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
        textShadowColor: colors.gray_900,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 40,
        backgroundColor: colors.gray_500,
        borderRadius: 5,
        color: 'transparent'
    },
})

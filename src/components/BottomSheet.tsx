import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import base from '~/css/base';
import colors from '~/css/colors';

interface Transaction {
    ID : number;
    DESCRIPTION : string;
    VALUE : number;
    DATE : Date;
    IS_EXPENSE:  number; 
    ICON : string;
}

interface BottomSheetProps {
    data: Transaction[];
}

function formatValue(value: number, isExpense: number): string {
    let valueStr = value.toString();
    const minus = isExpense ? '- ' : '';

    // existe ponto decimal
    if(value.toString().includes('.')){
        const regex = /^\d+\.\d$/;
        regex.test(valueStr) ? valueStr = valueStr.replace('.', ',') + '0' : valueStr = valueStr.replace('.', ',');
    } else {
        valueStr = valueStr;
    }

    return minus + 'R$ ' + valueStr;
}

function formatDate(dateStr: string): any {
    const date = dateStr.split('/');

    const day = date[1].length == 1 ? '0'+date[1] : date[1];
    const month = date[0].length == 1 ? '0'+date[0] : date[0];
    const year = date[2];
    
     return (`${day}/${month}/${year}`);
}

const BottomSheet: React.FC<BottomSheetProps> = ({ data }) => {
    // Agrupar transações por data
    const groupedTransactions: Record<string, Transaction[]> = data.reduce((acc, transaction) => {
        const date = new Date(transaction.DATE).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
    }, {} as Record<string, Transaction[]>);

    return (
        <View style={[styles.panelTransactions, base.px_25, base.p_20]}>
            <Text style={[styles.latestTransactions]}>Últimas transações</Text>
            {Object.keys(groupedTransactions).length > 0 && (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {Object.entries(groupedTransactions).map(([date, transactionsForDate]) => (
                        <View key={date}>
                            <View style={[
                                base.flexRow,
                                base.alignItemsCenter,
                                base.justifyContentCenter,
                                base.gap_12,
                                base.mt_15,
                                base.px_65
                            ]}>
                                <Text style={[styles.date]}>{formatDate(date)}</Text>
                                <View style={[styles.line]} />
                            </View>
                            <View>
                                <View style={[styles.containerTrasactions]}>
                                    {transactionsForDate.map((transaction, index) => (
                                        <View key={transaction.ID} style={[base.alignItemsCenter]}>
                                            <View style={[base.p_10, base.flexRow, base.flexSpaceBetween, base.alignItemsCenter, base.w_100]}>
                                                <View style={[base.flexRow, base.alignItemsCenter, base.gap_9]}>
                                                    <View style={[styles.containerIconTransactions, {
                                                        backgroundColor: transaction.IS_EXPENSE ? colors.red_1 : colors.green_1
                                                    }]}>
                                                        {/* TODO: Aplicar icon vindo do data */}
                                                        <FontAwesome6 name='car' color={colors.gray_900} size={15} />
                                                    </View>
                                                    <Text style={[styles.textTransaction]}>{transaction.DESCRIPTION}</Text>
                                                </View>
                                                <Text style={[styles.valueTransaction, {
                                                    color: transaction.IS_EXPENSE ? colors.red_1 : colors.green_1
                                                }]}>{formatValue(transaction.VALUE, transaction.IS_EXPENSE)}</Text>
                                            </View>
                                            {index !== transactionsForDate.length - 1 && <View style={[styles.divisor]} />}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
            <View style={[base.justifyContentCenter, base.alignItemsCenter, base.flex_1]}>
                {Object.keys(groupedTransactions).length === 0 && (
                    <View style={[base.justifyContentCenter, base.alignItemsCenter, base.gap_15]}>
                        <FontAwesome5 name="exclamation-triangle" size={40} color={'#F7D358'} />
                        <Text style={styles.noTransactionsMessage}>Parece que você ainda não fez nenhuma transação.</Text>
                        <Text style={styles.noTransactionsMessage}>Continue explorando!</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900
    },
    textAccount: {
        color: colors.white_300,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22
    },
    containerRetweet: {
        backgroundColor: colors.gray_800,
        borderRadius: 3,
        width: 18,
        height: 14
    },
    textValue: {
        color: colors.white_200,
        fontSize: 40,
        fontWeight: '500'
    },
    textValueEntrance: {
        color: colors.green_1,
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 22
    },
    textValueOutPut: {
        color: colors.red_1,
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 22
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
        color: colors.white_300,
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 22
    },
    panelTransactions: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.gray_800,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    latestTransactions: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.white_100
    },
    date: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.white_100
    },
    line: {
        width: '100%',
        height: 3,
        backgroundColor: colors.gray_3,
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
        backgroundColor: colors.gray_3,
        marginTop: 10
    },
    textTransaction: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.white_100
    },
    valueTransaction: {
        fontSize: 12,
        fontWeight: '500',
    },
    divisor: {
        width: 324,
        height: 1,
        backgroundColor: colors.gray_4
    },
    iconButtonAction: {
        width: 30,
        height: 30
    },
    noTransactionsMessage: {
        textAlign: 'center',
        color: colors.white_100,
        fontSize: 16,
        fontWeight: '500'
    }
})

export default BottomSheet;
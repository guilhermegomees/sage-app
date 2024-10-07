import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { monthsList } from '~/constants/monthsList';
import { TypeScreem } from '~/enums/enums';
import { ITransaction } from '~/interfaces/interfaces';
import base from '~/css/base';
import colors from '~/css/colors';

interface BottomSheetProps {
    data: ITransaction[];
    type: TypeScreem;
}

const monthNames = monthsList.map(month => month.substring(0, 3));

function formatValue(value: number, isExpense: number): string {
    const valueStr = value.toString().replace('.', ',');
    const minus = isExpense ? '- ' : '';
    return `${minus}R$ ${valueStr}`;
}

function formatDate(dateStr: string, type: TypeScreem): any {
    if (type == TypeScreem.Graphics) {
        const [year, month] = dateStr.split('-').map(Number);
        const monthName = monthNames[month - 1];
        return `${monthName}. ${year}`;
    } 

    const [month, day, year] = dateStr.split('/').map(part => part.padStart(2, '0'));
    return `${day}/${month}/${year}`;
}

const MainTabNavigator: React.FC<BottomSheetProps> = ({ data, type }) => {
    // Agrupar transações por data
    const groupedTransactions: Record<string, ITransaction[]> = data.reduce((acc, transaction) => {
        let date: string;

        if (type == TypeScreem.Graphics) {
            // Agrupar por mês
            const transactionDate = new Date(transaction.date);
            const month = transactionDate.getMonth() + 1;
            const year = transactionDate.getFullYear();
            date = `${year}-${month < 10 ? '0' : ''}${month}`; // Formato YYYY-MM
        } else {
            // Agrupar por dia
            date = new Date(transaction.date).toLocaleDateString();
        }

        if (!acc[date]) {
            acc[date] = [];
        }

        acc[date].push(transaction);
        return acc;
    }, {} as Record<string, ITransaction[]>);

    return (
        <View style={[
            styles.panelTransactions,
            { padding: type == TypeScreem.Transaction || type == TypeScreem.Graphics ? 0 : 20 },
            { paddingHorizontal: type == TypeScreem.Transaction || type == TypeScreem.Graphics ? 0 : 25 },
            { backgroundColor: type == TypeScreem.Transaction || type == TypeScreem.Graphics ? 'transparent' : colors.gray_800 }]}>
            {type == TypeScreem.Card &&
                <View style={[base.alignItemsCenter, base.mb_15, base.gap_10]}>
                    {/* TODO: Aplicar valores de 'limite' e 'limite utilizado' vindos do data */}
                    <Text style={[styles.cardValuesLimit]}>R$ 1.430 / R$ 3.200</Text>
                    {/* TODO: Calcular diferença entre 'limite' e 'limite utilizado' */}
                    <Text style={[styles.cardValueDifference]}>R$ 1.770</Text>
                </View>
            }
            {type == TypeScreem.Account && <Text style={[styles.latestTransactions]}>Últimas transações</Text>}
            {Object.keys(groupedTransactions).length > 0 && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 60}}
                >
                    {Object.entries(groupedTransactions).map(([date, transactionsForDate]) => {
                        // Calcula o valor total das transações para a data
                        const totalValue = transactionsForDate.reduce((acc, transaction) => {
                            return acc + (transaction.isExpense ? -transaction.value : transaction.value);
                        }, 0);

                        return (
                            <View key={date} style={[base.mb_15]}>
                                <View style={[
                                    base.flexRow,
                                    base.alignItemsCenter,
                                    { justifyContent: type == TypeScreem.Transaction || type == TypeScreem.Graphics ? 'space-between' : 'center' },
                                    { gap: type == TypeScreem.Transaction || type == TypeScreem.Graphics ? 0 : 12 },
                                    { paddingHorizontal: type == TypeScreem.Transaction || type == TypeScreem.Graphics ? 10 : 65 }
                                ]}>
                                    <Text style={[styles.date]}>{formatDate(date, type)}</Text>
                                    {(type == TypeScreem.Account || type == TypeScreem.Card) && <View style={[styles.line]} />}
                                    {(type == TypeScreem.Transaction || type == TypeScreem.Graphics) &&
                                        <Text style={[styles.valueTransaction, {
                                            color: totalValue < 0 ? colors.red_500 : colors.green_500
                                        }]}>
                                            {formatValue(Math.abs(totalValue), totalValue < 0 ? 1 : 0)}
                                        </Text>
                                    }
                                </View>
                                <View>
                                    <View style={[styles.containerTrasactions]}>
                                        {transactionsForDate.map((transaction, index) => (
                                            <View key={transaction.id} style={[base.alignItemsCenter]}>
                                                <View style={[base.p_10, base.flexRow, base.flexSpaceBetween, base.alignItemsCenter, base.w_100]}>
                                                    <View style={[base.flexRow, base.alignItemsCenter, base.gap_9]}>
                                                        <View style={[styles.containerIconTransactions, {
                                                            backgroundColor: transaction.isExpense ? colors.red_500 : colors.green_500
                                                        }]}>
                                                            <FontAwesome5 name={transaction.icon ?? 'star'} color={colors.gray_900} size={15} />
                                                        </View>
                                                        <Text style={[styles.textTransaction]}>{transaction.description}</Text>
                                                    </View>
                                                    <Text style={[styles.valueTransaction, {
                                                        color: transaction.isExpense ? colors.red_500 : colors.green_500
                                                    }]}>{formatValue(transaction.value, transaction.isExpense)}</Text>
                                                </View>
                                                {index !== transactionsForDate.length - 1 && <View style={[styles.divisor]} />}
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            )}
            {Object.keys(groupedTransactions).length === 0 && (
                <View style={[
                    base.justifyContentCenter, base.alignItemsCenter, base.flex_1,
                    { paddingBottom: type == TypeScreem.Graphics ? 70 : 0 },
                ]}>
                    <View style={[base.justifyContentCenter, base.alignItemsCenter, base.gap_15]}>
                        <Image source={require('./../assets/images/bankrupt.png')} tintColor={colors.gray_100} style={{width: 65, height: 65}}/>
                        <Text style={styles.noTransactionsMessage}>
                            {type == TypeScreem.Graphics 
                                ? 'Sem transações por aqui!'
                                : 'Parece que você ainda não fez nenhuma transação ou nenhuma transação foi encontrada!'}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900
    },
    textAccount: {
        color: colors.gray_400,
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
        color: colors.gray_100,
        fontSize: 40,
        fontWeight: '500'
    },
    textValueEntrance: {
        color: colors.green_500,
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 22
    },
    textValueOutPut: {
        color: colors.red_500,
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
        color: colors.gray_400,
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 22
    },
    panelTransactions: {
        flex: 1,
        width: '100%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    latestTransactions: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 18,
        marginBottom: 20,
        color: colors.gray_50
    },
    date: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 13,
        color: colors.gray_50,
    },
    line: {
        width: '100%',
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
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 12,
        color: colors.gray_50
    },
    valueTransaction: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 12,
    },
    divisor: {
        width: 324,
        height: 1,
        backgroundColor: colors.gray_700
    },
    iconButtonAction: {
        width: 30,
        height: 30
    },
    noTransactionsMessage: {
        fontFamily: 'Outfit_500Medium',
        textAlign: 'center',
        color: colors.gray_50,
        fontSize: 16,
    },
    cardValuesLimit: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.gray_50,
        fontSize: 18
    },
    cardValueDifference: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.blue_300,
        fontSize: 12
    }
})

export default MainTabNavigator;
import React from 'react';
import {
    FontAwesome5,
    colors,
    base,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TypeScreem,
    ITransaction,
    Image
} from '~/imports';

interface BottomSheetProps {
    data: ITransaction[];
    type: TypeScreem;
}

// Array com os nomes dos meses
const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

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

// TODO: Refatorar
function formatDate(dateStr: string, type: TypeScreem): any {
    let date;

    if (type == TypeScreem.Graphics) {
        const transactionDate = new Date(dateStr);
        const month = transactionDate.getMonth();
        const monthName = monthNames[month];
        const year = transactionDate.getFullYear();
        date = `${monthName}. ${year}`;
    } else {
        const transactionDate = dateStr.split('/');
        const day = transactionDate[1].length == 1 ? '0' + transactionDate[1] : transactionDate[1];
        const month = transactionDate[0].length == 1 ? '0' + transactionDate[0] : transactionDate[0];
        const year = transactionDate[2];
        date = `${day}/${month}/${year}`;
    }
    
    return date;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ data, type }) => {
    // Agrupar transações por data
    const groupedTransactions: Record<string, ITransaction[]> = data.reduce((acc, transaction) => {
        let date: string;

        if (type == TypeScreem.Graphics) {
            // Agrupar por mês
            const transactionDate = new Date(transaction.date);
            const month = transactionDate.getMonth() + 1; // Meses são baseados em zero em JavaScript
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
                <ScrollView showsVerticalScrollIndicator={false}>
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
                                            color: totalValue < 0 ? colors.red_1 : colors.green_1
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
                                                            backgroundColor: transaction.isExpense ? colors.red_1 : colors.green_1
                                                        }]}>

                                                            <FontAwesome5 name={transaction.icon ?? 'star'} color={colors.gray_900} size={15} />
                                                        </View>
                                                        <Text style={[styles.textTransaction]}>{transaction.description}</Text>
                                                    </View>
                                                    <Text style={[styles.valueTransaction, {
                                                        color: transaction.isExpense ? colors.red_1 : colors.green_1
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
            <View style={[base.justifyContentCenter, base.alignItemsCenter, base.flex_1]}>
                {Object.keys(groupedTransactions).length === 0 && (
                    <View style={[base.justifyContentCenter, base.alignItemsCenter, base.gap_15]}>
                        {/* <FontAwesome5 name="box-open" size={80} color={colors.white_200} /> */}
                        <Image source={require('./../assets/images/bankrupt.png')} tintColor={colors.white_200} style={{width: 70, height: 70}}/>
                        <Text style={styles.noTransactionsMessage}>
                            {type == TypeScreem.Graphics 
                                ? 'Sem transações por aqui!'
                                : 'Parece que você ainda não fez nenhuma transação ou nenhuma transação foi encontrada!'}
                        </Text>
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
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    latestTransactions: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 18,
        marginBottom: 20,
        color: colors.white_100
    },
    date: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 13,
        color: colors.white_100,
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
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 12,
        color: colors.white_100
    },
    valueTransaction: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 12,
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
        fontFamily: 'Outfit_500Medium',
        textAlign: 'center',
        color: colors.white_100,
        fontSize: 16,
    },
    cardValuesLimit: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.white_100,
        fontSize: 18
    },
    cardValueDifference: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.blue_50,
        fontSize: 12
    }
})

export default BottomSheet;
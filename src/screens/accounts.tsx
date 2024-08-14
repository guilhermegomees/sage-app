import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '../css/colors';
import { base } from '../css/base';
import React, { useContext, useEffect, useState } from 'react';
import { TypeScreem } from '~/enums';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import BottomSheet from '~/components/BottomSheet';
import { api } from '~/server/api'
import { ITransaction } from '~/interfaces';
import Header from '~/components/Header';
import { HeaderContext } from '~/context/HeaderContext';

// Formatar valores com duas casas decimais
function formatValue(value: number): string {
    let valueStr = value.toString();

    // existe ponto decimal
    if (valueStr.includes('.')) {
        const regex = /^\d+\.\d$/;
        regex.test(valueStr) ? valueStr = valueStr.replace('.', ',') + '0' : valueStr = valueStr.replace('.', ',');
    } else {
        valueStr = valueStr + ',00';
    }

    if (value < 0) {
        return '- R$ ' + Math.abs(parseFloat(valueStr)).toString() + ',00';
    }

    return 'R$ ' + valueStr;
}

type AccountsScreenNavigationProp = StackNavigationProp<any, 'Accounts'>;

export default function Accounts() {
    const navigation = useNavigation<AccountsScreenNavigationProp>();

    const { showValues } = useContext(HeaderContext);
    
    const [data, setData] = useState<ITransaction[]>([]);
    // const userId = 2; // TODO: Trazer id com base no usuário logado
    // const wallet = 2; // TODO: Trazer id da wallet com base na carteira selecionada

    // const fetchData = async (): Promise<any> => {
    //   try {
    //     const response = await api.get(`/transaction?userId=${userId}`);
    //     const formattedData = response.data.data.filter((item: ITransaction) => item.wallet === wallet);
    //     setData(formattedData);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    const transactions: ITransaction[] = [
        { id: 1, description: "Salário", value: 3000, date: '2024-01-03T03:00:00.000Z', isExpense: 0, icon: 'star', wallet: 1 },
        { id: 2, description: "Pix", value: 550, date: '2024-01-03T03:00:00.000Z', isExpense: 0, icon: 'star', wallet: 1 },
        { id: 12, description: "Pix", value: 400, date: '2024-01-03T03:00:00.000Z', isExpense: 1, icon: 'star', wallet: 1 },
        { id: 14, description: "Pix", value: 3200, date: '2024-01-04T03:00:00.000Z', isExpense: 1, icon: 'star', wallet: 1 },
        { id: 3, description: "Salário", value: 3000, date: '2024-02-03T03:00:00.000Z', isExpense: 0, icon: 'star', wallet: 1 },
        { id: 4, description: "Pix", value: 800, date: '2024-02-03T03:00:00.000Z', isExpense: 0, icon: 'star', wallet: 1 },
        { id: 13, description: "Pix", value: 400, date: '2024-02-03T03:00:00.000Z', isExpense: 1, icon: 'star', wallet: 1 },
        { id: 5, description: "Salário", value: 3000, date: '2024-03-03T03:00:00.000Z', isExpense: 0, icon: 'star', wallet: 1 },
        { id: 6, description: "Pix", value: 1500, date: '2024-03-03T03:00:00.000Z', isExpense: 0, icon: 'star', wallet: 1 },
        { id: 7, description: "Pix", value: 1500, date: '2024-03-03T03:00:00.000Z', isExpense: 1, icon: 'star', wallet: 1 },
        { id: 8, description: "Pix", value: 2000, date: '2024-04-03T03:00:00.000Z', isExpense: 0, icon: 'star', wallet: 1 },
        { id: 9, description: "Pix", value: 1500, date: '2024-04-03T03:00:00.000Z', isExpense: 1, icon: 'star', wallet: 1 },
        { id: 10, description: "Pix", value: 2000, date: '2024-06-03T03:00:00.000Z', isExpense: 0, icon: 'star', wallet: 1 },
        { id: 11, description: "Pix", value: 1500, date: '2024-06-03T03:00:00.000Z', isExpense: 1, icon: 'star', wallet: 1 }
    ];

    useEffect(() => {
        setData(transactions);
    }, []);

    // TODO: Calcular o total de entradas e saídas para a wallet específica
    let totalExpenses = 0;
    let totalIncome = 0;

    for (const item of data) {
        if (item.isExpense === 1) {
            totalExpenses += item.value;
        } else {
            totalIncome += item.value;
        }
    }

    const handleNavigateToNewTransaction = () => {
        navigation.navigate('NewTransaction');
    };

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
                            <FontAwesome name='caret-up' color={colors.green_500} size={20} />
                            <Text style={[styles.textValueEntrance, !showValues && styles.hideValues, styles.shortText]}>{formatValue(totalIncome)}</Text>
                        </View>
                        <View style={[base.flexRow, base.alignItemsCenter, base.justifyContentCenter, base.gap_5]}>
                            <FontAwesome name='caret-down' color={colors.red_500} size={20} />
                            <Text style={[styles.textValueOutPut, !showValues && styles.hideValues, styles.shortText]}>{formatValue(totalExpenses)}</Text>
                        </View>
                    </View>
                </View>
                {/* Botões de ação */}
                <View style={[styles.buttonsActionsContainer]}>
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
                </View>
                {/* Painel de transações */}
                <BottomSheet data={data} type={TypeScreem.Account} />
            </View>
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
    }
})
import { Text, View, TouchableOpacity, StyleSheet, LayoutChangeEvent, Dimensions, ScrollView, Image } from 'react-native';
import { colors } from '../css/colors';
import { base } from '../css/base';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { TypeScreem } from '~/enums';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Icons
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import BottomSheet from '~/components/BottomSheet';

import { api } from '~/server/api'
import { ITransaction } from '~/interfaces';

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

  const [data, setData] = useState<ITransaction[]>([]);
  const userId = 2; // TODO: Trazer id com base no usuário logado
  const wallet = 2; // TODO: Trazer id da wallet com base na carteira selecionada

  const fetchData = async (): Promise<any> => {
    try {
      const response = await api.get(`/transaction?userId=${userId}`);
      const formattedData = response.data.data.filter((item: ITransaction) => item.wallet === wallet);
      setData(formattedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calcular o total de entradas e saídas para a wallet específica
  let totalExpenses = 0;
  let totalIncome = 0;

  for (const item of data) {
    if (item.is_expense === 1) {
      totalExpenses += item.value;
    } else {
      totalIncome += item.value;
    }
  }

  const handleNavigateToGraphic = () => {
    navigation.navigate('Graphic');
  };

  const handleNavigateToTransactions = () => {
    navigation.navigate('Transactions');
  };

  return (
    <View style={[styles.container, base.flex_1, base.alignItemsCenter, base.pt_25, base.gap_25]}>
      {/* Conta */}
      <View style={[base.flexRow, base.alignItemsCenter, base.justifyContentCenter, base.gap_8]}>
        {/* TODO: Aplicar nome da carteira vindo do data */}
        <Text style={[styles.textWallet]}>[Wallet]</Text>
        <View style={[styles.containerRetweet, base.alignItemsCenter, base.justifyContentCenter]}>
          <FontAwesome6 name='repeat' color={colors.white} size={12} />
        </View>
      </View>
      {/* Valores */}
      <View style={[base.flexColumn, base.alignItemsCenter, base.justifyContentCenter, base.gap_8]}>
        {/* TODO: Aplicar valor da conta vindo do data */}
        <Text style={[styles.textValue]}>{formatValue(totalIncome - totalExpenses)}</Text>
        <View style={[base.alignItemsCenter, base.justifyContentCenter, base.flexRow, base.gap_15]}>
          <View style={[base.flexRow, base.alignItemsCenter, base.justifyContentCenter, base.gap_5]}>
            <FontAwesome name='caret-up' color={colors.green_1} size={20} />
            <Text style={[styles.textValueEntrance]}>{formatValue(totalIncome)}</Text>
          </View>
          <View style={[base.flexRow, base.alignItemsCenter, base.justifyContentCenter, base.gap_5]}>
            <FontAwesome name='caret-down' color={colors.red_1} size={20} />
            <Text style={[styles.textValueOutPut]}>{formatValue(totalExpenses)}</Text>
          </View>
        </View>
      </View>
      {/* Botões de ação */}
      <View style={[styles.buttonsActionsContainer]}>
        <View style={[styles.buttonAction]}>
          <TouchableOpacity>
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
        <View style={[styles.buttonAction]}>
          <TouchableOpacity onPress={handleNavigateToGraphic}>
            <View style={[styles.button]}>
              <Image source={require('./../assets/images/chart-pie.png')} style={[styles.iconButtonAction]} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.textBtnsActions]}>Gráfico</Text>
        </View>
        <View style={[styles.buttonAction]}>
          <TouchableOpacity onPress={handleNavigateToTransactions}>
            <View style={[styles.button]}>
              <Image source={require('./../assets/images/money-transactions.png')} style={styles.iconButtonAction} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.textBtnsActions]}>Transações</Text>
        </View>
      </View>
      {/* Painel de transações */}
      <BottomSheet data={data} type={TypeScreem.Account} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray_900
  },
  textWallet: {
    fontFamily: 'Outfit_500Medium',
    color: colors.white_300,
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
    color: colors.white_200,
    fontSize: 40,
  },
  textValueEntrance: {
    fontFamily: 'Outfit_500Medium',
    color: colors.green_1,
    fontSize: 14,
    lineHeight: 22
  },
  textValueOutPut: {
    fontFamily: 'Outfit_500Medium',
    color: colors.red_1,
    fontSize: 14,
    lineHeight: 22
  },
  buttonsActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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
    color: colors.white_300,
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
    color: colors.white_100
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.white_100
  },
  line: {
    width: 207,
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
    width: 29,
    height: 29
  },
  iconBalanceButtonAction: {
    width: 28,
    height: 26
  }
})
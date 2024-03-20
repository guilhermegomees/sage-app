import { Text, View, TouchableOpacity, StyleSheet, LayoutChangeEvent, Dimensions, ScrollView, Image } from 'react-native';
import { colors } from '../css/colors';
import { base } from '../css/base';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

// Icons
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import BottomSheet from '~/components/BottomSheet';

import { api } from '~/server/api'

import { useFocusEffect } from '@react-navigation/native';

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

export default function Accounts() {
  const [data, setData] = useState<any[]>([]);
  const userId = 2; // TODO: Trazer id com base no usuário logado
  const wallet = 2; // TODO: Trazer id da wallet com base na carteira selecionada

  const fetchData = async (): Promise<any> => {
    try {
      const response = await api.get(`/transaction?userId=${userId}`);
      const formattedData = response.data.data.filter((item: any) => item.WALLET === wallet);
      setData(formattedData);
    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  // Calcular o total de entradas e saídas para a wallet específica
  let totalExpenses = 0;
  let totalIncome = 0;

  for (const item of data) {
    if (item.IS_EXPENSE === 1) {
      totalExpenses += item.VALUE;
    } else {
      totalIncome += item.VALUE;
    }
  }

  return (
    <View style={[styles.container, base.flex_1, base.alignItemsCenter, base.pt_25, base.gap_25]}>
      
      {/* Conta */}
      <View style={[base.flexRow, base.alignItemsCenter, base.justifyContentCenter, base.gap_8]}>
        {/* TODO: Aplicar nome da carteira vindo do data */}
        <Text style={[styles.textAccount]}>[Wallet]</Text>
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
      <View style={[base.flexRow, base.alignItemsCenter, base.justifyContentCenter, base.gap_25]}>
        <View style={[base.alignItemsCenter, base.justifyContentCenter, base.gap_8]}>
          <TouchableOpacity>
            <View style={[styles.buttonsActions]}>
              <Image source={require('./../image/recive.png')} style={styles.iconButtonAction} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.textBtnsActions]}>Receber</Text>
        </View>
        <View style={[base.alignItemsCenter, base.justifyContentCenter, base.gap_8]}>
          <TouchableOpacity>
            <View style={[styles.buttonsActions]}>
              <Image source={require('./../image/expense.png')} style={styles.iconButtonAction} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.textBtnsActions]}>Despesa</Text>
        </View>
        <View style={[base.alignItemsCenter, base.justifyContentCenter, base.gap_8]}>
          <TouchableOpacity>
            <View style={[styles.buttonsActions]}>
              <Image source={require('./../image/balance.png')} style={[styles.iconButtonAction, { height: 28 }]} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.textBtnsActions]}>Balancear</Text>
        </View>
        <View style={[base.alignItemsCenter, base.justifyContentCenter, base.gap_8]}>
          <TouchableOpacity>
            <View style={[styles.buttonsActions]}>
              <FontAwesome6 name="chart-pie" color={colors.white_100} size={28} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.textBtnsActions]}>Gráficos</Text>
        </View>
      </View>

      <BottomSheet data={data} />
    </View>
  );
}

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
    width: 30,
    height: 30
  }
})
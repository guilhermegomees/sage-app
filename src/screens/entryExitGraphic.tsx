import React, { useEffect, useState } from 'react';
import { VictoryChart, VictoryTheme, VictoryBar, VictoryGroup } from 'victory-native';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  colors,
  base,
  Image,
  MaterialIcons,
  useNavigation,
  StackNavigationProp,
} from '~/imports';

import { TypeScreem } from '~/enums';
import { ITransaction } from '~/interfaces';
import BottomSheet from '~/components/BottomSheet';

type EntryExitGraphicScreenNavigationProp = StackNavigationProp<any, 'EntryExitGraphic'>;

export default function EntryExitGraphic() {
  const navigation = useNavigation<EntryExitGraphicScreenNavigationProp>();

  const handleNavigateToBack = () => {
    navigation.navigate('Graphic');
  };

  const fetchTransactions = async (): Promise<void> => {
    //TODO: Trazer transações através do banco e popular o data
    const data: ITransaction[] = [
      {
        DATE: '2024-01-03T03:00:00.000Z',
        CATEGORY: "Alimentação",
        DESCRIPTION: 'Compra em supermercado',
        ICON: 'shopping-cart',
        ID: 1,
        IS_EXPENSE: 1,
        VALUE: 150.75,
        WALLET: 1,
      },
      {
        DATE: '2024-02-03T03:00:00.000Z',
        DESCRIPTION: 'Pix do Panzo',
        CATEGORY: "Alimentação",
        ICON: 'bolt',
        ID: 2,
        IS_EXPENSE: 0,
        VALUE: 80.5,
        WALLET: 1,
      },
      {
        DATE: '2024-03-03T03:00:00.000Z',
        DESCRIPTION: 'Jantar em restaurante',
        CATEGORY: "Alimentação",
        ICON: 'utensils',
        ID: 3,
        IS_EXPENSE: 1,
        VALUE: 65.3,
        WALLET: 1,
      },
      {
        DATE: '2024-12-3T03:00:00.000Z',
        DESCRIPTION: 'Compra online',
        CATEGORY: "Alimentação",
        ICON: 'shopping-bag',
        ID: 4,
        IS_EXPENSE: 1,
        VALUE: 200.0,
        WALLET: 1,
      },
      {
        DATE: '2024-11-2T03:00:00.000Z',
        DESCRIPTION: 'Compra em loja de roupas',
        CATEGORY: "Alimentação",
        ICON: 'tshirt',
        ID: 7,
        IS_EXPENSE: 1,
        VALUE: 100.0,
        WALLET: 1,
      },
      {
        DATE: '2024-10-01T03:00:00.000Z',
        DESCRIPTION: 'Assinatura de serviço online',
        CATEGORY: "Alimentação",
        ICON: 'subscription',
        ID: 8,
        IS_EXPENSE: 1,
        VALUE: 15.99,
        WALLET: 1,
      },
    ];

    setTransactions(data);
    setFilteredTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const processTransactions = (transactions: ITransaction[]) => {
    const processedData: { x: string; red: number; green: number }[] = [];

    transactions.forEach((transaction) => {
      const date = new Date(transaction.DATE);
      const month = date.toLocaleString('default', { month: 'short' });

      const existingIndex = processedData.findIndex((item) => item.x === month);
      if (existingIndex !== -1) {
        if (transaction.IS_EXPENSE) {
          processedData[existingIndex].red += transaction.VALUE;
        } else {
          processedData[existingIndex].green += transaction.VALUE;
        }
      } else {
        processedData.push({
          x: month,
          red: transaction.IS_EXPENSE ? transaction.VALUE : 0,
          green: transaction.IS_EXPENSE ? 0 : transaction.VALUE,
        });
      }
    });

    return processedData;
  };

  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>([]);
  const [data, setData] = useState<{ x: string; red: number; green: number }[]>([]);

  useEffect(() => {
    const processedData = processTransactions(transactions);
    setData(processedData);
  }, [transactions]);

  return (
    <View style={[styles.container, base.flex_1]}>
      <View style={[styles.containerBack]}>
        <TouchableOpacity onPress={handleNavigateToBack}>
          <MaterialIcons name="chevron-left" size={30} color={colors.white_100} />
        </TouchableOpacity>
        <Text style={[styles.title]}>Entrada e Saída</Text>
      </View>
      <View style={styles.chartContainer}>
        <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
          <VictoryGroup offset={20}>
            <VictoryBar style={{ data: { fill: '#FF6347' } }} data={data} x="x" y="red" />
            <VictoryBar style={{ data: { fill: '#32CD32' } }} data={data} x="x" y="green" />
          </VictoryGroup>
        </VictoryChart>
        <BottomSheet data={filteredTransactions} type={TypeScreem.Graphics} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray_900,
    paddingHorizontal: 20,
    flex: 1,
  },
  containerBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 25,
  },
  title: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.white_100,
    fontSize: 20,
    marginLeft: 10,
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

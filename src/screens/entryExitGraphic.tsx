import React, { useEffect, useState } from 'react';
import { 
  VictoryChart,
  VictoryTheme,
  VictoryBar,
  VictoryGroup,
  VictoryAxis,
  VictoryLabel,
  VictoryAnimation,
  VictoryPie,
  VictoryTooltip
} from 'victory-native';
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

import { Card, CardProps } from '../components/Card';
import { Header, MonthsProps } from '../components/Header';
import { REVENUES } from '../../utils/transactions';
import { EXPENSES } from '../../utils/transactions';
import { TypeScreem } from '~/enums';
import { IRevenue, ITransaction } from '~/interfaces';
import BottomSheet from '~/components/BottomSheet';

import PeriodSelector from '~/components/PeriodSelector';

interface DataItem {
  period: string;
  revenue: number;
  expenses: number;
}

type EntryExitGraphicScreenNavigationProp = StackNavigationProp<any, 'EntryExitGraphic'>;

export default function EntryExitGraphic() {
  const navigation = useNavigation<EntryExitGraphicScreenNavigationProp>();

  // const [selected, setSelected] = useState("");
  // const [month, setMonth] = useState<MonthsProps>("Janeiro");
  // const [expenses, setExpenses] = useState<{ x: string[], y: number }[]>([]);
  // const [revenues, setRevenues] = useState<{ x: string[], y: number }[]>([]);

  const handleNavigateToBack = () => {
    navigation.navigate('Graphic');
  };

  // function handleCardOnPress(id: string) {
  //   setSelected(prev => prev === id ? "" : id);
  // }

  // useEffect(() => {
  //   fetchTransactions();
  // }, [month]);

  //const fetchTransactions = async (): Promise<void> => {
    //TODO: Trazer transações através do banco e popular o data
    // const data: ITransaction[] = [
    //   {
    //     DATE: '2024-02-03T03:00:00.000Z',
    //     CATEGORY: "Alimentação",
    //     DESCRIPTION: 'Compra em supermercado',
    //     ICON: 'shopping-cart',
    //     ID: 1,
    //     IS_EXPENSE: 1,
    //     VALUE: 150.75,
    //     WALLET: 1,
    //   },
    //   {
    //     DATE: '2024-02-03T03:00:00.000Z',
    //     DESCRIPTION: 'Pix do Panzo',
    //     CATEGORY: "Alimentação",
    //     ICON: 'bolt',
    //     ID: 2,
    //     IS_EXPENSE: 0,
    //     VALUE: 100,
    //     WALLET: 1,
    //   },
    //   {
    //     DATE: '2024-03-03T03:00:00.000Z',
    //     CATEGORY: "Alimentação",
    //     DESCRIPTION: 'Compra em supermercado',
    //     ICON: 'shopping-cart',
    //     ID: 3,
    //     IS_EXPENSE: 1,
    //     VALUE: 150.75,
    //     WALLET: 1,
    //   },
    //   {
    //     DATE: '2024-03-03T03:00:00.000Z',
    //     DESCRIPTION: 'Pix do Panzo',
    //     CATEGORY: "Alimentação",
    //     ICON: 'bolt',
    //     ID: 4,
    //     IS_EXPENSE: 0,
    //     VALUE: 80.5,
    //     WALLET: 1,
    //   },
    //   {
    //     DATE: '2024-04-03T03:00:00.000Z',
    //     DESCRIPTION: 'Jantar em restaurante',
    //     CATEGORY: "Alimentação",
    //     ICON: 'utensils',
    //     ID: 5,
    //     IS_EXPENSE: 1,
    //     VALUE: 65.3,
    //     WALLET: 1,
    //   },
    //   {
    //     DATE: '2024-04-03T03:00:00.000Z',
    //     DESCRIPTION: 'Pix do Panzo',
    //     CATEGORY: "Alimentação",
    //     ICON: 'bolt',
    //     ID: 6,
    //     IS_EXPENSE: 0,
    //     VALUE: 105,
    //     WALLET: 1,
    //   },
    //   {
    //     DATE: '2024-05-3T03:00:00.000Z',
    //     DESCRIPTION: 'Compra online',
    //     CATEGORY: "Alimentação",
    //     ICON: 'shopping-bag',
    //     ID: 7,
    //     IS_EXPENSE: 1,
    //     VALUE: 200.0,
    //     WALLET: 1,
    //   },
    //   {
    //     DATE: '2024-05-03T03:00:00.000Z',
    //     DESCRIPTION: 'Pix do Panzo',
    //     CATEGORY: "Alimentação",
    //     ICON: 'bolt',
    //     ID: 8,
    //     IS_EXPENSE: 0,
    //     VALUE: 250,
    //     WALLET: 1,
    //   },
    // ];

    //setRevenues(processTransactions(REVENUES[month]))
    //setExpenses(processTransactions(EXPENSES[month]))

    // setTransactions(data);
    // setFilteredTransactions(data);
  //};

  // useEffect(() => {
  //   fetchTransactions();
  // }, []);

  // const processTransactions = (transactions: any[]) => {
  //   const totalSum : number = transactions.reduce((acc, transaction) => acc + transaction.value, 0);

  //   const label : string[] = transactions.map((transaction) => {
  //     return transaction.label;
  //   });

  //   return [{
  //     x: label,
  //     y: totalSum
  //   }];
  // };

  // const [transactions, setTransactions] = useState<ITransaction[]>([]);
  // const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>([]);
  //const [data, setData] = useState<{ monthAndYear: string; red: number; green: number }[]>([]);

  // useEffect(() => {
  //   const processedData = processTransactions(transactions);
  //   setData(processedData);
  // }, [transactions]);

  const [currentPeriod, setCurrentPeriod] = useState<string>('Mar 2024 - Mai 2024');

  const data: DataItem[] = [
    { period: 'Dez 2023 - Fev 2024', revenue: 3500, expenses: 1000 },
    { period: 'Mar 2024 - Mai 2024', revenue: 3000, expenses: 2000 },
    { period: 'Jun 2024 - Ago 2024', revenue: 2500, expenses: 1500 },
    { period: 'Set 2024 - Nov 2024', revenue: 2000, expenses: 1000 },
  ];

  const filteredData = data.filter(item => item.period === currentPeriod);

  const handlePrevPeriod = () => {
    const prevIndex = data.findIndex(item => item.period === currentPeriod) - 1;
    if (prevIndex >= 0) {
      setCurrentPeriod(data[prevIndex].period);
    }
  };

  const handleNextPeriod = () => {
    const nextIndex = data.findIndex(item => item.period === currentPeriod) + 1;
    if (nextIndex < data.length) {
      setCurrentPeriod(data[nextIndex].period);
    }
  };

  return (
    <View style={[styles.container, base.flex_1]}>
      <View style={[styles.containerBack]}>
        <TouchableOpacity onPress={handleNavigateToBack}>
          <MaterialIcons name="chevron-left" size={30} color={colors.white_100} />
        </TouchableOpacity>
        <Text style={[styles.title]}>Entrada e Saída</Text>
      </View>
      {/* <Header
        onValueChange={setMonth}
        selectedValue={month}
      /> */}
      <PeriodSelector
        currentPeriod={currentPeriod}
        onPrevPeriod={handlePrevPeriod}
        onNextPeriod={handleNextPeriod}
      />
      <View style={styles.chartContainer}>
        <VictoryChart theme={VictoryTheme.material} domainPadding={50} padding={{top: 10, bottom: 50, left: 60, right: 40}}>
          {/* <VictoryAxis
            dependentAxis
            tickLabelComponent={<VictoryLabel dx={5} style={[{ fill: colors.subTitle, fontSize: 12 }]} />}
            tickFormat={(x) => (`R$ ${x}`)}
            style={{
              axis: { stroke: 'none' },
              grid: { 
                stroke: colors.gray_800,
                strokeDasharray: 1, // Remove o efeito pontilhado
              },
              ticks: { stroke: 'none' },
            }}
          />
          <VictoryAxis
            tickFormat={(x) => (`${x} `)}
            tickLabelComponent={<VictoryLabel style={[{ fill: colors.subTitle, fontSize: 12 }]}/>}
            style={{
              axis: { stroke: colors.gray_800 },
              grid: { stroke: 'none' }, // Remove a linha pontilhada do grid
              ticks: { stroke: 'none' },
            }}
          /> */}
          <VictoryAxis
            label="Período"
            tickValues={filteredData.map(item => item.period)}
            tickFormat={(period) => period}
          />
          <VictoryAxis
            dependentAxis
            label="Valor"
          />
          <VictoryGroup offset={25}>
            <VictoryBar
              barWidth={25}
              style={{ data: { fill: '#32CD32' } }}
              data={filteredData}
              x="period"
              y="revenue"
            />
            <VictoryBar 
              barWidth={25}
              style={{ data: { fill: '#FF6347' } }} 
              data={filteredData}
              x="period"
              y="expenses"
            />
          </VictoryGroup>
        </VictoryChart>
        {/* <BottomSheet data={filteredTransactions} type={TypeScreem.Graphics} /> */}
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

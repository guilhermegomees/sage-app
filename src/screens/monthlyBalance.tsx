import React, { useEffect, useState } from 'react';
import { 
  VictoryChart,
  VictoryTheme,
  VictoryBar,
  VictoryGroup,
  VictoryAxis,
} from 'victory-native';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  colors,
  base,
  MaterialIcons,
  useNavigation,
  StackNavigationProp,
  TypeScreem,
} from '~/imports';

import PeriodSelector from '~/components/PeriodSelector';
import { ITransaction } from '~/interfaces';
import BottomSheet from '~/components/BottomSheet';

interface DataItem {
  month: number; // Mês (1 para Janeiro, 2 para Fevereiro, etc.)
  year: number; // Ano (2023, 2024, etc.)
  revenue: number; // Receita do mês
  expenses: number; // Despesas do mês
}

// Array com os nomes dos meses
const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function getMonthAndYearFromDate(date: string): [number, number] {
  const parsedDate = new Date(date);
  const month = parsedDate.getMonth() + 1; // Ajustar para 1-baseado
  const year = parsedDate.getFullYear();

  return [month, year];
}

function mapDataToDataItem(transactions: ITransaction[]): DataItem[] {
  return transactions.map(item => {
    const [month, year] = getMonthAndYearFromDate(item.date);

    return {
      month: month,
      year: year,
      revenue: !item.isExpense ? item.value : 0, // Definir receita como valor positivo
      expenses: item.isExpense ? Math.abs(item.value) : 0, // Definir despesa como valor absoluto negativo
    };
  });
}

function calculateMonthlyTotals(data: DataItem[]): DataItem[] {
  const monthlyTotals: DataItem[] = [];

  const groupedData: { [key: string]: { revenue: number; expenses: number } } = {};

  data.forEach(item => {
    const key = `${item.year}-${item.month}`;

    if (!groupedData[key]) {
      groupedData[key] = { revenue: 0, expenses: 0 };
    }

    groupedData[key].revenue += item.revenue;
    groupedData[key].expenses += item.expenses;
  });

  for (const key in groupedData) {
    const [year, month] = key.split('-').map(Number);
    const { revenue, expenses } = groupedData[key];
    monthlyTotals.push({
      month,
      year,
      revenue,
      expenses,
    });
  }

  return monthlyTotals;
}

// Função para obter a lista de meses dentro do período especificado
function getMonthsInRange(startMonth: number, endMonth: number): number[] {
  const months: number[] = [];
  for (let month = startMonth; month <= endMonth; month++) {
    months.push(month);
  }
  return months;
}

// Função para criar um objeto DataItem com valores de receita e despesa como zero
function createEmptyDataItem(month: number, year: number): DataItem {
  return {
    month: month,
    year: year,
    revenue: 0,
    expenses: 0
  };
}

function filterMonthlyTotalsByPeriod(monthlyTotals: DataItem[], currentPeriod: string): DataItem[] {
  const [periodStartMonth, periodEndMonth] = getMonthFromPeriod(currentPeriod);
  const periodYear = getYearFromPeriod(currentPeriod);

  // Obter a lista de meses dentro do período
  const monthsInRange = getMonthsInRange(periodStartMonth, periodEndMonth);

  // Filtrar os monthlyTotals para incluir apenas os meses dentro do período
  const filteredItems = monthlyTotals.filter(item => item.month >= periodStartMonth && item.month <= periodEndMonth && item.year == periodYear);
  
  // Verificar se algum mês está faltando e adicionar um objeto DataItem com valores de receita e despesa como zero
  if (filteredItems.length > 0) {
    for (let month of monthsInRange) {
      const found = filteredItems.some(item => item.month === month);
      if (!found) {
        const emptyItem = createEmptyDataItem(month, periodYear);
        filteredItems.push(emptyItem);
      }
    }
  }

  // TODO: Refatorar
  const result = filteredItems.sort((a, b) => a.month - b.month);
  if (filteredItems.length > 0) {
    result.splice(0, 0, createEmptyDataItem(0, periodYear));
    result.splice(2, 0, createEmptyDataItem(0, periodYear));
    result.splice(4, 0, createEmptyDataItem(0, periodYear));
  }

  return result;
}

function getYearFromPeriod(period: string): number {
  const [startDateStr, endDateStr] = period.split(' - ');
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  return startDate.getFullYear();
}

function getMonthFromPeriod(period: string): [number, number] {
  const [startDateStr, endDateStr] = period.split(' - ');
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const startMonth = startDate.getMonth() + 1;
  const endMonth = endDate.getMonth() + 1;

  return [startMonth, endMonth];
}

function getPeriodFromMonth(date: Date): string {
  const monthName = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${monthName}. ${year}`;
}

function getPeriodFormated(period: string): string {
  const [startDateString, endDateString] = period.split(' - ');
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  return `${getPeriodFromMonth(startDate)} - ${getPeriodFromMonth(endDate)}`;
}

function filterTransactionsByPeriod(transactions: ITransaction[], currentPeriod: string) {
  const [periodStartMonth, periodEndMonth] = getMonthFromPeriod(currentPeriod);
  const periodYear = getYearFromPeriod(currentPeriod);

  // Filtrar as transações para incluir apenas os meses dentro do período
  return transactions.filter(transaction => {
    const date = new Date(transaction.date);
    return date.getMonth() + 1 >= periodStartMonth && date.getMonth() + 1 <= periodEndMonth && date.getFullYear() == periodYear;
  });
}

type EntryExitGraphicScreenNavigationProp = StackNavigationProp<any, 'EntryExitGraphic'>;

export default function EntryExitGraphic() {
  const navigation = useNavigation<EntryExitGraphicScreenNavigationProp>();

  const handleNavigateToBack = () => {
    navigation.navigate('ChartList');
  };

  // Dados de receita e despesa
  const transactions : ITransaction[] = [
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

  // TODO: Definir periodo inicial de acordo com mês atual
  // Período atual selecionado
  const [currentPeriod, setCurrentPeriod] = useState('2024-01 - 2024-03');

  function handlePrevPeriod() {
    // Desestruturar a string de período atual em data de início e data de término
    const startDateStr = currentPeriod.split(' - ');
    const startDate = new Date(startDateStr[0]);

    // Calcular a data do próximo período
    const prevStartDate = new Date(startDate.getFullYear(), startDate.getMonth() - 3, 1);
    const prevEndDate = new Date(prevStartDate.getFullYear(), prevStartDate.getMonth() + 3, 0);

    // Formatar as datas no formato YYYY-MM
    const formattedPrevStartDate = `${prevStartDate.getFullYear()}-${String(prevStartDate.getMonth() + 1).padStart(2, '0')}`;
    const formattedPrevEndDate = `${prevEndDate.getFullYear()}-${String(prevEndDate.getMonth() + 1).padStart(2, '0')}`;

    setCurrentPeriod(`${formattedPrevStartDate} - ${formattedPrevEndDate}`);
  }

  function handleNextPeriod() {
    // Desestruturar a string de período atual em data de início e data de término
    const startDateStr = currentPeriod.split(' - ');
    const startDate = new Date(startDateStr[0]);

    // Calcular a data do próximo período
    const nextStartDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 1); // Ajustar para o primeiro dia do mês seguinte com intervalo de 3 meses
    const nextEndDate = new Date(nextStartDate.getFullYear(), nextStartDate.getMonth() + 3, 0); // Ajustar para o último dia do mês seguinte com intervalo de 3 meses

    // Formatar as datas no formato YYYY-MM
    const formattedNextStartDate = `${nextStartDate.getFullYear()}-${String(nextStartDate.getMonth() + 1).padStart(2, '0')}`;
    const formattedNextEndDate = `${nextEndDate.getFullYear()}-${String(nextEndDate.getMonth() + 1).padStart(2, '0')}`;

    setCurrentPeriod(`${formattedNextStartDate} - ${formattedNextEndDate}`);
  }

  // Mapear dados para DataItem
  const data = mapDataToDataItem(transactions);

  // Calcular totais mensais
  const monthlyTotals = calculateMonthlyTotals(data);

  // Filtrar dados por período
  const filteredData = filterMonthlyTotalsByPeriod(monthlyTotals, currentPeriod);

  const filteredTransactions = filterTransactionsByPeriod(transactions, currentPeriod);

  // TODO: Refatorar
  const customTickFormat = (monthIndex : number) => {
    const [startMonth, endMonth] = getMonthFromPeriod(currentPeriod);
    const periodYear = getYearFromPeriod(currentPeriod);
    let index;

    if (startMonth == 1 && endMonth == 3) { // primeiro trimestre
      index = monthIndex == 1 ? 1 : monthIndex == 3 ? 2 : 3;
    } else if (startMonth == 4 && endMonth == 6) { // segundo trimestre
      index = monthIndex == 1 ? -2 : monthIndex == 3 ? -1 : 0;
    } else if (startMonth == 7 && endMonth == 9) { // terceiro trimestre
      index = monthIndex == 1 ? -5 : monthIndex == 3 ? -4 : -3;
    } else { // quarto trimestre
      index = monthIndex == 1 ? -8 : monthIndex == 3 ? -7 : -6;
    }

    return `${monthNames[monthIndex - index]}. ${periodYear}`;
  };
  
  return (
    <View style={[styles.container, base.flex_1]}>
      {/* <View style={[styles.containerBack]}>
        <TouchableOpacity onPress={handleNavigateToBack}>
          <MaterialIcons name="chevron-left" size={30} color={colors.gray_50} />
        </TouchableOpacity>
        <Text style={[styles.title]}>Balanço mensal</Text>
      </View> */}
      <PeriodSelector
        currentPeriod={getPeriodFormated(currentPeriod)}
        onPrevPeriod={handlePrevPeriod}
        onNextPeriod={handleNextPeriod}
      />
      <View style={[styles.chartContainer]}>
        <VictoryChart theme={VictoryTheme.material} domainPadding={40} padding={{ top: 0, bottom: 100, left: 80, right: 20 }}>
          <VictoryAxis
            tickValues={[1, 3, 5]}
            tickCount={3}
            tickFormat={customTickFormat}
            style={{
              axis: { stroke: colors.gray_800 },
              grid: { stroke: 'none' },
              ticks: { stroke: 'none', size: 2 },
              tickLabels: { fontSize: 12, padding: 10, fill: colors.blue_400 }
            }}
          />
          <VictoryAxis
            dependentAxis
            tickValues={filteredData.length > 0 ? undefined : [0, 1000, 2000, 3000, 4000]}
            tickFormat={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
            offsetX={75}
            style={{
              axis: { stroke: 'none' },
              grid: { stroke: colors.gray_800, strokeWidth: 2, strokeDasharray: 1 },
              ticks: { stroke: 'transparent', size: 2 },
              tickLabels: { fontSize: 12, padding: 5, fill: colors.blue_400 },
            }}
          />
          <VictoryGroup offset={35}>
            <VictoryBar
              barWidth={35}
              style={{ data: { fill: '#32CD32' } }}
              data={filteredData}
              x="period"
              y="revenue"
            />
            <VictoryBar
              barWidth={35}
              style={{ data: { fill: '#FF6347' } }}
              data={filteredData}
              x="period"
              y="expenses"
            />
          </VictoryGroup>
        </VictoryChart>
      </View>
      <BottomSheet data={filteredTransactions} type={TypeScreem.Graphics} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray_900,
    paddingHorizontal: 10,
    flex: 1,
  },
  containerBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  title: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.gray_50,
    fontSize: 20,
    marginLeft: 10,
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

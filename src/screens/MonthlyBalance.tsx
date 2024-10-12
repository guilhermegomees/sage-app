import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
    VictoryChart,
    VictoryTheme,
    VictoryBar,
    VictoryGroup,
    VictoryAxis,
} from 'victory-native';
import PeriodSelector from '~/components/PeriodSelector';
import BottomSheet from '~/components/BottomSheet';
import { monthsList } from '~/constants/monthsList';
import { ITransaction } from '~/interfaces/interfaces';
import base from '~/css/base';
import colors from '~/css/colors';
import { charts, TypeScreem } from '~/enums/enums';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '~/config';

interface DataItem {
    month: number;
    year: number;
    revenue: number;
    expenses: number;
}

const monthNames = monthsList.map(month => month.substring(0, 3));

function parseDate(date: Date): [number, number] {
    return [date.getMonth() + 1, date.getFullYear()];
}

function mapTransactionsToData(transactions: ITransaction[]): Record<string, DataItem> {
    return transactions.reduce((acc, item) => {
        const [month, year] = parseDate(item.date);
        const key = `${year}-${month}`;
        if (!acc[key]) {
            acc[key] = { month, year, revenue: 0, expenses: 0 };
        }
        acc[key].revenue += item.isExpense ? 0 : item.value;
        acc[key].expenses += item.isExpense ? Math.abs(item.value) : 0;
        return acc;
    }, {} as Record<string, DataItem>);
}

function getPeriodLimits(period: string): [number, number, number] {
    const [startDateStr, endDateStr] = period.split(' - ');
    const startDate = new Date(startDateStr + 'T00:00:00.000Z');
    const endDate = new Date(endDateStr + 'T00:00:00.000Z');

    const startMonth = startDate.getUTCMonth() + 1
    const endMonth = endDate.getUTCMonth() + 1;
    const startYear = startDate.getUTCFullYear();

    return [startMonth, endMonth, startYear];
}

function fillMissingMonths(data: Record<string, DataItem>, [startMonth, endMonth, year]: [number, number, number]): DataItem[] {
    const result: DataItem[] = [];

    // Verifica se há transações no período selecionado
    const hasTransactions = Object.keys(data).some(key => {
        const [dataYear, dataMonth] = key.split('-').map(Number);
        return dataYear === year && dataMonth >= startMonth && dataMonth <= endMonth;
    });

    if (!hasTransactions) {
        return result;
    }

    // Adiciona o primeiro registro zerado
    result.push({ month: 0, year, revenue: 0, expenses: 0 });

    for (let month = startMonth; month <= endMonth; month++) {
        const key = `${year}-${month}`;

        if (data[key]) {
            result.push(data[key]);
        } else {
            result.push({ month, year, revenue: 0, expenses: 0 });
        }

        // Adiciona o registro zerado após cada mês, exceto para o último
        if (month < endMonth) {
            result.push({ month: 0, year, revenue: 0, expenses: 0 });
        }
    }

    return result;
}

function filterTransactionsByPeriod(transactions: ITransaction[], [startMonth, endMonth, year]: [number, number, number]) {
    // Filtrar as transações para incluir apenas os meses dentro do período
    return transactions.filter(transaction => {
        const date = new Date(transaction.date);
        return date.getMonth() + 1 >= startMonth && date.getMonth() + 1 <= endMonth && date.getFullYear() == year;
    });
}

export default function MonthlyBalance() {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [currentPeriod, setCurrentPeriod] = useState('');

    const transactionCollectionRef = collection(db, "transaction");

    const convertToDate = (timeObject: { seconds: number; nanoseconds: number }): Date => {
        const { seconds, nanoseconds } = timeObject;

        const millisecondsFromSeconds = seconds * 1000;
        const millisecondsFromNanoseconds = nanoseconds / 1_000_000;
        const totalMilliseconds = millisecondsFromSeconds + millisecondsFromNanoseconds;

        return new Date(totalMilliseconds);
    };

    const fetchTransactions = async (): Promise<void> => {
        try {
            const querySnapshot = await getDocs(transactionCollectionRef);
            const data: ITransaction[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                description: doc.data().description,
                date: convertToDate(doc.data().date),
                category: doc.data().category,
                isExpense: doc.data().isExpense,
                value: doc.data().value,
                account: doc.data().account,
                user: doc.data().user
            }));

            setTransactions(data);
        } catch (error) {
            console.error("Erro ao buscar transações: ", error);
        }
    };

    useEffect(() => {
        fetchTransactions();

        const now = new Date();
        const currentMonth = now.getMonth() + 1; // getMonth() retorna meses de 0-11
        const currentYear = now.getFullYear();

        let startMonth = '';
        let endMonth = '';

        // Definir o período trimestral com base no mês atual
        if (currentMonth >= 1 && currentMonth <= 3) {
            startMonth = '01';
            endMonth = '03';
        } else if (currentMonth >= 4 && currentMonth <= 6) {
            startMonth = '04';
            endMonth = '06';
        } else if (currentMonth >= 7 && currentMonth <= 9) {
            startMonth = '07';
            endMonth = '09';
        } else if (currentMonth >= 10 && currentMonth <= 12) {
            startMonth = '10';
            endMonth = '12';
        }

        // Atualizar o estado com o formato 'YYYY-MM - YYYY-MM'
        setCurrentPeriod(`${currentYear}-${startMonth} - ${currentYear}-${endMonth}`);
    }, []);

    const handlePeriodChange = (direction: 'prev' | 'next') => {
        const [startMonth, , year] = getPeriodLimits(currentPeriod);
        const offset = direction === 'prev' ? -3 : 3;
        const newStartMonth = startMonth + offset;
        const newStartDate = new Date(Date.UTC(year, newStartMonth - 1, 1));
        const newEndDate = new Date(Date.UTC(newStartDate.getFullYear(), newStartMonth + 2, 0));

        setCurrentPeriod(`${newStartDate.toISOString().slice(0, 7)} - ${newEndDate.toISOString().slice(0, 7)}`);
    };

    const customTickFormat = (monthIndex: number) => {
        const quarters: Record<string, [number, number, number]> = {
            '1-3': [1, 2, 3],
            '4-6': [-2, -1, 0],
            '7-9': [-5, -4, -3],
            '10-12': [-8, -7, -6]
        };

        const key = `${startMonth}-${endMonth}`;

        // Verifica se o key existe em quarters
        if (!quarters[key]) {
            return '';
        }

        const [index1, index2, index3] = quarters[key];
        const index = monthIndex === 1 ? index1 : monthIndex === 3 ? index2 : index3;

        return `${monthNames[monthIndex - index]}. ${year}`;
    };


    const [startMonth, endMonth, year] = getPeriodLimits(currentPeriod);
    const filteredTransactions = filterTransactionsByPeriod(transactions, [startMonth, endMonth, year]);
    const data = useMemo(() => mapTransactionsToData(transactions), [transactions]);
    const filteredData = useMemo(() => fillMissingMonths(data, [startMonth, endMonth, year]), [data, startMonth, endMonth, year]);
    
    return (
        <View style={[styles.container, base.flex_1]}>
            <PeriodSelector
                currentPeriod={`${monthNames[startMonth - 1]}. ${year} - ${monthNames[endMonth - 1]}. ${year}`}
                onPrevPeriod={() => handlePeriodChange('prev')}
                onNextPeriod={() => handlePeriodChange('next')}
                chart={charts.bar}
            />
            <View style={[styles.chartContainer]}>
                <VictoryChart theme={VictoryTheme.material} domainPadding={50} height={270} padding={{ top: 10, bottom: 40, left: 80, right: 20 }}>
                    <VictoryAxis
                        tickValues={[1, 3, 5]}
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
                        tickValues={filteredData.length > 0 ? undefined : [5000, 10000, 15000, 20000, 25000]}
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
    chartContainer: {
        alignItems: 'center',
    },
});

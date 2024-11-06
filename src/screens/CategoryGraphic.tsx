import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { VictoryPie, VictoryTooltip } from 'victory-native';
import { CardTransaction, CardProps } from '~/components/CardTransaction';
import PeriodSelector from '~/components/PeriodSelector';
import { monthsList } from '~/constants/monthsList';
import base from '~/css/base';
import { charts } from '~/enums/enums';
import colors from '~/css/colors';
import { useTransactions } from '~/context/TransactionContext';

export default function CategoryGraphic() {
	const currentDate = new Date();
	const currentMonth = monthsList[currentDate.getMonth()];
	const currentYear = currentDate.getFullYear();

	const { transactions } = useTransactions();
	const [totalExpenses, setTotalExpenses] = useState<number>(0);
	const [selected, setSelected] = useState("");
	const [month, setMonth] = useState(currentMonth);
	const [year, setYear] = useState(currentYear);
	const [data, setData] = useState<CardProps[]>([]);
	const [filter, setFilter] = useState<'expense' | 'income'>('expense');

	useEffect(() => {
		const filteredTransactions = transactions.filter(transaction => {
			const transactionDate = new Date(transaction.date);
			const transactionMonth = transactionDate.getMonth();
			const transactionYear = transactionDate.getFullYear();
		
			const isCorrectMonth = transactionMonth === monthsList.indexOf(month);
			const isCorrectYear = transactionYear === year; // Adiciona a verificação do ano
			const isCorrectType = filter === 'expense' ? transaction.isExpense : !transaction.isExpense;
		
			return isCorrectMonth && isCorrectYear && isCorrectType;
		});
		
		const total = filteredTransactions.reduce((acc, transaction) => acc + transaction.value, 0);
		setTotalExpenses(total);

		const mappedData = filteredTransactions.map(transaction => {
			const percent = ((transaction.value / total) * 100).toFixed(2) + '%';
			return {
				id: transaction.id,
				label: transaction.description,
				value: transaction.value,
				color: transaction.category?.color,
				percent: percent,
				isExpense: transaction.isExpense
			} as CardProps;
		});

		setData(mappedData);
	}, [month, filter, transactions]);

	function handleCardOnPress(id: string) {
		setSelected(prev => prev === id ? "" : id);
	}

	function handlePrevPeriod() {
		setMonth(prevMonth => {
			const currentIndex = monthsList.indexOf(prevMonth);
			const newIndex = (currentIndex - 1 + monthsList.length) % monthsList.length;
			const newMonth = monthsList[newIndex];
	
			// Decrementa o ano se o novo mês for dezembro (indicando uma volta de ano)
			if (newIndex === monthsList.length - 1) {
				setYear(prevYear => prevYear - 1);
			}
	
			return newMonth;
		});
	}
	

	function handleNextPeriod() {
		setMonth(prevMonth => {
			const currentIndex = monthsList.indexOf(prevMonth);
			const newIndex = (currentIndex + 1) % monthsList.length;
			const newMonth = monthsList[newIndex];
	
			// Incrementa o ano se o novo mês for janeiro (indicando a mudança de ano)
			if (newIndex === 0) {
				setYear(prevYear => prevYear + 1);
			}
	
			return newMonth;
		});
	}

	return (
		<View style={[styles.container, base.flex_1]}>
			<View style={styles.filterContainer}>
				<TouchableOpacity onPress={() => setFilter('expense')} style={[styles.filterButton, { backgroundColor: filter === 'expense' ? colors.blue_600 : colors.gray_800 }]}>
					<Text style={styles.filterText}>Despesas por categoria</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => setFilter('income')} style={[styles.filterButton, { backgroundColor: filter === 'income' ? colors.blue_600 : colors.gray_800 }]}>
					<Text style={styles.filterText}>Receitas por categoria</Text>
				</TouchableOpacity>
			</View>
			<PeriodSelector
				currentPeriod={month}
				currentYear={year}
				onPrevPeriod={handlePrevPeriod}
				onNextPeriod={handleNextPeriod}
				chart={charts.pie}
			/>
			<View style={[styles.chartWrapper]}>
				{data.length > 0 && (
					<>
						<VictoryPie
							data={data}
							x="label"
							y="value"
							height={270}
							colorScale={data.map(transaction => transaction.color)}
							innerRadius={90}
							padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
							style={{
								labels: {
									fill: '#fff',
									fontSize: 16,
								},
								data: {
									fillOpacity: ({ datum }) => (datum.id === selected || selected === "") ? 1 : 0.5,
									stroke: ({ datum }) => (datum.id === selected || selected === "") ? datum.color : 'none',
									strokeOpacity: 0.5,
								}
							}}
							labelComponent={
								<VictoryTooltip
									renderInPortal={false}
									flyoutStyle={{
										stroke: 0,
										fill: ({ datum }) => datum.color,
									}}
								/>
							}
						/>
						<Text style={styles.totalExpenses}>R$ {totalExpenses.toFixed(2).replace('.', ',')}</Text>
					</>
				)}
				{data.length == 0 && (
					<View style={[styles.containerNoData]}>
						<Text style={[styles.noDataTitle]}>Nenhuma transação encontrada</Text>
						<Text style={[styles.noDataSubtitle]}>Quer uma visão mais organizada dos seus gastos? Adicione suas transações.</Text>
					</View>
				)}
			</View>
			{data.length > 0 && (
				<ScrollView
					style={styles.scrollView}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 90 }}
				>
					{data.map(item => (
						<CardTransaction
							key={item.id}
							style={[styles.card]}
							data={item}
							selected={false}
							onPress={() => handleCardOnPress(item.id)}
						/>
					))}
				</ScrollView>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.gray_900,
		flex: 1,
	},
	chartWrapper: {
		marginVertical: 20,
		marginBottom: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontFamily: 'Outfit_600SemiBold',
		color: colors.gray_50,
		fontSize: 20,
		marginLeft: 10,
	},
	filterContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 10,
		marginVertical: 15
	},
	filterButton: {
		padding: 10,
		borderRadius: 30,
	},
	filterText: {
		color: colors.white,
		fontFamily: 'Outfit_500Medium',
		fontSize: 14,
	},
	card: {
		backgroundColor: '#1D222C',
		borderRadius: 15,
		height: 50
	},
	totalExpenses: {
		position: 'absolute',
		textAlign: 'center',
		fontFamily: 'Outfit_400Regular',
		color: colors.gray_50,
		fontSize: 18,
	},
	graphic: {
		alignItems: "center",
	},
	scrollView: {
		paddingHorizontal: 20,
		paddingTop: 20,
		backgroundColor: colors.gray_800,
		borderRadius: 20
	},
	containerNoData: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '70%',
		gap: 10,
		marginTop: 100
	},
	noDataTitle: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 18,
        height: 18,
        color: colors.gray_150,
        textAlign: 'center',
    },
    noDataSubtitle: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        color: colors.gray_200,
        textAlign: 'center',
    }
});

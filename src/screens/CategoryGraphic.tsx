import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { VictoryPie, VictoryTooltip } from 'victory-native';
import { CardTransaction, CardProps } from '~/components/CardTransaction';
import PeriodSelector from '~/components/PeriodSelector';
import { monthsList } from '~/constants/monthsList';
import { ICategory, ITransaction } from '~/interfaces/interfaces';
import base from '~/css/base';
import { charts } from '~/enums/enums';
import colors from '~/css/colors';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '~/config';

export default function CategoryGraphic() {
	const currentDate = new Date();
	const currentMonth = monthsList[currentDate.getMonth()];
	const currentYear = currentDate.getFullYear();

	const [transactions, setTransactions] = useState<ITransaction[]>([]);
	const [totalExpenses, setTotalExpenses] = useState<number>(0);
	const [selected, setSelected] = useState("");
	const [month, setMonth] = useState(currentMonth);
	const [year, setYear] = useState(currentYear);
	const [data, setData] = useState<CardProps[]>([]);
	const [filter, setFilter] = useState<'expense' | 'income'>('expense');

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

		const filteredTransactions = transactions.filter(transaction => {
			const transactionMonth = new Date(transaction.date).getMonth();
			const isCorrectMonth = transactionMonth === monthsList.indexOf(month);
			const isCorrectType = filter === 'expense' ? transaction.isExpense : transaction.isExpense === false;
			return isCorrectMonth && isCorrectType;
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
	}, [month, filter]);

	function handleCardOnPress(id: string) {
		setSelected(prev => prev === id ? "" : id);
	}

	function handlePrevPeriod() {
		setMonth(prevMonth => {
			const currentIndex = monthsList.indexOf(prevMonth);
			const newIndex = (currentIndex - 1 + monthsList.length) % monthsList.length;
			return monthsList[newIndex];
		});
	}

	function handleNextPeriod() {
		setMonth(prevMonth => {
			const currentIndex = monthsList.indexOf(prevMonth);
			const newIndex = (currentIndex + 1) % monthsList.length;
			return monthsList[newIndex];
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
					<View style={[styles.emptyContainer]}>
						<Image source={require('./../assets/images/empty.png')} style={styles.emptyImg} />
						<Text style={[styles.emptyMsg]}>Ops, você não possui {filter === 'expense' ? 'despesas' : 'receitas'} registradas.</Text>
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
		marginTop: 15
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
	emptyContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '70%',
		gap: 15,
		marginTop: 50
	},
	emptyMsg: {
		color: colors.gray_100,
		fontFamily: 'Outfit_500Medium',
		fontSize: 18,
		textAlign: 'center'
	},
	emptyImg: {
		height: 110,
		width: 110
	}
});

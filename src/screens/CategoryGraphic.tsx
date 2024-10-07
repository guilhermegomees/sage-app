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

// Categorias
export const categories: ICategory[] = [
    {
        id: 1,
        user: "user1",
        icon: "home",
        name: "Moradia",
        color: "#FF6347",
    },
    {
        id: 2,
        user: "user1",
        icon: "apple-alt",
        name: "Alimentação",
        color: "#FFD700",
    },
    {
        id: 3,
        user: "user2",
        icon: "car",
        name: "Transporte",
        color: "#1E90FF",
    },
    {
        id: 4,
        user: "user3",
        icon: "heart",
        name: "Saúde",
        color: "#FF1493",
    },
    {
        id: 5,
        user: "user1",
        icon: "star",
        name: "Lazer",
        color: "#32CD32",
    },
    {
        id: 6,
        user: "user2",
        icon: "book",
        name: "Educação",
        color: "#8A2BE2",
    },
    {
        id: 7,
        user: "user1",
        icon: "briefcase",
        name: "Salário",
        color: "#00FF0D",
    },
    {
        id: 8,
        user: "user2",
        icon: "hand-holding-heart",
        name: "Doação",
        color: "#FF4500",
    },
    {
        id: 9,
        user: "user3",
        icon: "shopping-cart",
        name: "Compras",
        color: "#FF8C00",
    },
    {
        id: 10,
        user: "user1",
        icon: "running",
        name: "Esportes",
        color: "#00BFFF",
    },
    {
        id: 11,
        user: "user2",
        icon: "cocktail",
        name: "Bebidas",
        color: "#DC143C",
    },
    {
        id: 12,
        user: "user3",
        icon: "plane",
        name: "Viagens",
        color: "#4682B4",
    },
    {
        id: 13,
        user: "user1",
        icon: "gift",
        name: "Presentes",
        color: "#FF69B4",
    },
    {
        id: 14,
        user: "user3",
        icon: "tools",
        name: "Manutenção",
        color: "#A52A2A",
    },
    {
        id: 15,
        user: "user2",
        icon: "dollar-sign",
        name: "Investimentos",
        color: "#228B22",
    }
];

// Dados de despesas
const transactions: ITransaction[] = [
	{ id: 1, description: "Salário", value: 3000, date: '2024-09-01T03:00:00.000Z', isExpense: 0, wallet: 1, category: categories[6] }, // Salário
	{ id: 2, description: "Pagamento de aluguel", value: 1200, date: '2024-09-03T03:00:00.000Z', isExpense: 1, wallet: 1, category: categories[0] }, // Moradia
	{ id: 3, description: "Supermercado", value: 450, date: '2024-09-03T03:00:00.000Z', isExpense: 1, wallet: 1, category: categories[1] }, // Alimentação
	{ id: 4, description: "Pix - Reembolso", value: 150, date: '2024-09-05T03:00:00.000Z', isExpense: 0, wallet: 1, category: categories[4] }, // Lazer
	{ id: 5, description: "Restaurante", value: 200, date: '2024-09-05T03:00:00.000Z', isExpense: 1, wallet: 1, category: categories[1] }, // Alimentação
	{ id: 6, description: "Conta de luz", value: 180, date: '2024-09-08T03:00:00.000Z', isExpense: 1, wallet: 1, category: categories[0] }, // Moradia
	{ id: 7, description: "Academia", value: 100, date: '2024-09-08T03:00:00.000Z', isExpense: 1, wallet: 1, category: categories[3] }, // Saúde
	{ id: 8, description: "Pix - Transferência poupança", value: 500, date: '2024-09-10T03:00:00.000Z', isExpense: 1, wallet: 2, category: categories[4] }, // Lazer
	{ id: 9, description: "Bônus anual", value: 1500, date: '2024-09-10T03:00:00.000Z', isExpense: 0, wallet: 1, category: categories[6] }, // Salário
	{ id: 10, description: "Manutenção do carro", value: 400, date: '2024-09-12T03:00:00.000Z', isExpense: 1, wallet: 1, category: categories[2] }, // Transporte
	{ id: 11, description: "Jantar especial", value: 250, date: '2024-09-12T03:00:00.000Z', isExpense: 1, wallet: 1, category: categories[4] }, // Lazer
	{ id: 12, description: "Consultoria freelance", value: 800, date: '2024-09-15T03:00:00.000Z', isExpense: 0, wallet: 2, category: categories[5] }, // Educação
	{ id: 13, description: "Doação para caridade", value: 100, date: '2024-09-15T03:00:00.000Z', isExpense: 1, wallet: 1, category: categories[7] }, // Doação
];


export default function CategoryGraphic() {
	const currentDate = new Date();
	const currentMonth = monthsList[currentDate.getMonth()];
	const currentYear = currentDate.getFullYear();

	const [totalExpenses, setTotalExpenses] = useState<number>(0);
	const [selected, setSelected] = useState("");
	const [month, setMonth] = useState(currentMonth);
	const [year, setYear] = useState(currentYear);
	const [data, setData] = useState<CardProps[]>([]);
	const [filter, setFilter] = useState<'expense' | 'income'>('expense');

	function handleCardOnPress(id: string) {
		setSelected(prev => prev === id ? "" : id);
	}

	useEffect(() => {
		const filteredTransactions = transactions.filter(transaction => {
			const transactionMonth = new Date(transaction.date).getMonth();
			const isCorrectMonth = transactionMonth === monthsList.indexOf(month);
			const isCorrectType = filter === 'expense' ? transaction.isExpense === 1 : transaction.isExpense === 0;
			return isCorrectMonth && isCorrectType;
		});

		const total = filteredTransactions.reduce((acc, transaction) => acc + transaction.value, 0);
		setTotalExpenses(total);

		const mappedData = filteredTransactions.map(transaction => {
			const percent = ((transaction.value / total) * 100).toFixed(2) + '%';
			return {
				id: transaction.id.toString(),
				label: transaction.description,
				value: transaction.value,
				color: transaction.category?.color,
				percent: percent,
				isExpense: transaction.isExpense
			} as CardProps;
		});

		setData(mappedData);
	}, [month, filter]);

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

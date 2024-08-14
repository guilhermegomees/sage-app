import React, { useEffect, useState } from 'react';
import { VictoryPie, VictoryTooltip } from 'victory-native';
import { Text, View, StyleSheet, colors, base, StackNavigationProp } from '~/imports';
import { FlatList } from 'react-native';
import { EXPENSES } from '../../utils/transactions';
import { Card, CardProps } from '../components/Card';
import { Header, MonthsProps } from '../components/Header/index';
import { useNavigation } from '@react-navigation/native';

type CategoryGraphicScreenNavigationProp = StackNavigationProp<any, 'CategoryGraphic'>;

export default function CategoryGraphic() {
	const navigation = useNavigation<CategoryGraphicScreenNavigationProp>();
	const [totalExpenses, setTotalExpenses] = useState<number>(0);
	const [selectedCategory, setSelectedCategory] = useState<{ category: string, total: number, description: string } | null>(null);
	const [selected, setSelected] = useState("");
	const [month, setMonth] = useState<MonthsProps>("Janeiro");
	const [data, setData] = useState<CardProps[]>([]);

	const handleNavigateToBack = () => {
		navigation.navigate('ChartList');
	};

	function handleCardOnPress(id: string) {
		setSelected(prev => prev === id ? "" : id);
	}

	useEffect(() => {
		setData(EXPENSES[month]);

		const total = EXPENSES[month].reduce((acc, expense) => acc + expense.value, 0);
		setTotalExpenses(total);
	}, [month]);

	return (
		<View style={[styles.container, base.flex_1]}>
			{/* <View style={[styles.containerBack]}>
        <TouchableOpacity onPress={handleNavigateToBack}>
          <MaterialIcons name="chevron-left" size={30} color={colors.gray_50} />
        </TouchableOpacity>
        <Text style={[styles.title]}>Transação por categoria</Text>
      </View> */}
			<View style={styles.chartContainer}>
				<Header
					onValueChange={setMonth}
					selectedValue={month}
				/>
				<View style={[styles.graphic]}>
					<VictoryPie
						data={data}
						x="label"
						y="value"
						colorScale={data.map(expense => expense.color)}
						innerRadius={90}
						style={{
							labels: {
								fill: '#fff'
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
									fill: ({ datum }) => datum.color
								}}
							/>
						}
					/>
				</View>
				<Text style={styles.totalExpenses}>R$ {totalExpenses.toFixed(2).replace('.', ',')}</Text>

				<FlatList
					style={styles.flatList}
					data={EXPENSES[month]}
					keyExtractor={item => item.id}
					renderItem={({ item }) => (
						<Card
							style={[styles.card]}
							data={item}
							selected={false}
							onPress={() => handleCardOnPress(item.id)}
						/>
					)}
					showsVerticalScrollIndicator={false}
				/>
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
		color: colors.gray_50,
		fontSize: 20,
		marginLeft: 10,
	},
	chartContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	totalExpenses: {
		marginTop: -30,
		fontFamily: 'Outfit_400Regular',
		color: colors.gray_50,
		fontSize: 16,
		textAlign: 'center'
	},
	card: {
		backgroundColor: '#1D222C',
		borderRadius: 15,
		height: 50
	},
	graphic: {
		alignItems: "center"
	},
	flatList: {
		marginTop: 40
	}
});

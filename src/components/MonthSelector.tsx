import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView } from 'react-native';
import { MONTHS } from '../../utils/months';
import { base, colors } from "~/imports";

export type MonthsProps = "Janeiro" | "Fevereiro" | "Março" | "Abril" | "Maio" | "Junho" | "Julho" | "Agosto" | "Setembro" | "Outubro" | "Novembro" | "Dezembro";

type Props = {
	selectedValue: MonthsProps;
	onValueChange: (value: MonthsProps) => void;
}

export function MonthSelector({ selectedValue, onValueChange }: Props) {
	return (
		<View style={[styles.container]}>
			<ScrollView
				contentContainerStyle={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				horizontal={true}
			>
				{
					MONTHS.map(item => (
						<TouchableOpacity
							key={item.label}
							style={[
								styles.button,
								selectedValue === item.label && styles.selectedButton
							]}
							onPress={() => onValueChange(item.label as MonthsProps)}
						>
							<Text style={[
								styles.buttonText,
								selectedValue === item.label && styles.selectedButtonText
							]}>
								{item.label}
							</Text>
						</TouchableOpacity>
					))
				}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
		overflow: 'hidden',
	},
	scrollContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 10,
	},
	button: {
		backgroundColor: colors.gray_900,
		borderRadius: 20,
		paddingVertical: 8,
		paddingHorizontal: 25,
		margin: 5,
	},
	selectedButton: {
		backgroundColor: colors.blue_600,
	},
	buttonText: {
		color: colors.white,
		fontSize: 16,
	},
	selectedButtonText: {
		color: colors.white,
	},
});

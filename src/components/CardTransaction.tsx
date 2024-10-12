import React from "react";
import { TouchableOpacityProps, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import colors from "~/css/colors";

export type CardProps = {
	id: string;
	label: string;
	value: number;
	color: string;
	percent: string;
	isExpense: boolean;
};

type Props = TouchableOpacityProps & {
	selected: boolean;
	data: CardProps;
}

export function CardTransaction({ data, selected, ...rest }: Props) {
	return (
		<Container selected={selected} color={data.color} {...rest}>
			<Tag color={data.color} />
			<Title style={styles.title}>
				{data.label}
			</Title>
			<Amount style={[styles.amount, { color: data.isExpense ? colors.red_500 : colors.green_500 }]}>
				{
					data.value.toLocaleString('pt-BR', {
						style: 'currency',
						currency: 'BRL'
					})
				}
			</Amount>
		</Container>
	);
}

const Container = styled.TouchableOpacity<{ selected: boolean; color: string; }>`
	width: 100%;
	height: 50px;
	margin-bottom: 16px;
	flex-direction: row;
	align-items: center;
	background: #FFF;
	overflow: hidden;
	border: ${({ selected, color }) => selected ? `4px solid ${color}` : 'none'};
`;

const Tag = styled.View<{ color: string; }>`
	width: 10px;
	height: 80px;
	margin-right: 16px;
	background: ${({ color }) => color};
`;

const Title = styled.Text`
	flex: 1;
	font-weight: bold;
	font-size: 16px;
`;

const Amount = styled.Text`
  	margin-right: 16px;
`;

const styles = StyleSheet.create({
	title: {
		color: '#F8F1F1',
		fontFamily: 'Outfit_400Regular'
	},
	amount: {
		fontFamily: 'Outfit_400Regular'
	},
});

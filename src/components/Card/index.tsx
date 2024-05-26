import React from "react";
import { TouchableOpacityProps, StyleSheet } from 'react-native';
import { Container, Tag, Title, Amount } from './styles';
import { colors } from "~/imports";

export type CardProps = {
  id: string;
  label: string;
  value: number;
  color: string;
  percent: string;
};

type Props = TouchableOpacityProps & {
  selected: boolean;
  data: CardProps;
}

export function Card({ data, selected, ...rest }: Props) {
  return (
    <Container selected={selected} color={data.color} {...rest}>
      <Tag color={data.color} />

      <Title style={styles.title}>
        {data.label}
      </Title>

      <Amount style={styles.amount}>
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
const styles = StyleSheet.create({
  title: {
    color: '#F8F1F1', 
    fontFamily: 'Outfit_400Regular'
  },
  amount: {
    color: '#F03838', 
    fontFamily: 'Outfit_400Regular'
  },
});
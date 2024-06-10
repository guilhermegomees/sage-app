import React from "react";
import { Button, View, StyleSheet } from 'react-native';

import { Container, Title } from './styles';

import { MONTHS } from '../../../utils/months';
import { base, colors } from "~/imports";

export type MonthsProps = "Janeiro" | "Fevereiro" | "Março";

type Props = {
  selectedValue: MonthsProps;
  onValueChange: (value: MonthsProps) => void;
}

export function Header({ selectedValue, onValueChange }: Props) {
  return (
    <Container>
      <View style={styles.buttonContainer}>
        {
          MONTHS.map(item => (
            <Button
              key={item.label}
              title={item.label}
              color={selectedValue === item.label ? colors.blue_100 : colors.gray_900}
              onPress={() => onValueChange(item.label as MonthsProps)}
            />
          ))
        }
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    
  },
});

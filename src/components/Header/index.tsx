import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

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
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
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
    backgroundColor: colors.blue_100,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
  },
  selectedButtonText: {
    color: colors.white,
  },
});

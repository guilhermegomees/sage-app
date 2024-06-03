import React from "react";
import { Picker } from '@react-native-picker/picker';

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
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue: MonthsProps) => onValueChange(itemValue)}
        dropdownIconColor={colors.white_100}
        style={{
          backgroundColor: colors.gray_800,
          color: colors.white_100,
          flex: 1,
          borderWidth: 1,
          borderRadius: 10
        }}
      >
        {
          MONTHS.map(item => (
            <Picker.Item
              key={item.label}
              label={item.label}
              value={item.label}
            />
          ))
        }
      </Picker>
    </Container>
  );
}
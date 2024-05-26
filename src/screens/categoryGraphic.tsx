import React, { useEffect, useState } from 'react';
import { VictoryPie, VictoryLabel, VictoryTooltip } from 'victory-native';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  colors,
  base,
  MaterialIcons,
  StackNavigationProp
} from '~/imports';

import { FlatList } from 'react-native';
import { EXPENSES } from '../../utils/expenses';
import { Card, CardProps } from '../components/Card';
import { Header, MonthsProps } from '../components/Header';

import { TypeScreem } from '~/enums';
import { ITransaction } from '~/interfaces';
import BottomSheet from '~/components/BottomSheet';

import { useNavigation } from '@react-navigation/native';

type CategoryGraphicScreenNavigationProp = StackNavigationProp<any, 'CategoryGraphic'>;

export default function CategoryGraphic() {
  const navigation = useNavigation<CategoryGraphicScreenNavigationProp>();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<{ x: string; y: number; z: string }[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<{ category: string, total: number, description: string } | null>(null);

  const handleNavigateToBack = () => {
    navigation.navigate('Graphic');
  };

  const [selected, setSelected] = useState("");
  const [month, setMonth] = useState<MonthsProps>("Janeiro");
  const [data, setData] = useState<CardProps[]>([]);

  function handleCardOnPress( id: string ){
    setSelected(prev => prev === id ? "" :id);
  }

  useEffect(() => {
    setData(EXPENSES[month])
  }, [month]);

  return (
    <View style={[styles.container, base.flex_1]}>
      <View style={[styles.containerBack]}>
        <TouchableOpacity onPress={handleNavigateToBack}>
          <MaterialIcons name="chevron-left" size={30} color={colors.white_100} />
        </TouchableOpacity>
        <Text style={[styles.title]}>Transação por categoria</Text>
      </View>
      <View style={styles.chartContainer}>
      <Header
        onValueChange={setMonth}
        selectedValue={month}
      />
      <VictoryPie
        data={data}
        x="label"
        y="value"
        colorScale={data.map(expense => expense.color)} //Pegar escala de cor de cada item
        innerRadius={90} //Adicionar um Circulo no meio
        //  animate={{
        //    easing: "back"
        // }}
        style={{
          labels: {
            fill: '#fff' 
          }, //Cor da Label
          data: {
            fillOpacity: ({ datum }) => (datum.id === selected || selected === "") ? 1 : 0.5,
            stroke: ({ datum }) => (datum.id === selected || selected === "") ? datum.color : 'none',
            strokeOpacity: 0.5,
          } //Selecionar cada fatia no grafico
        }}
        labelComponent={
          <VictoryTooltip //ToolTip é a nuvem de Informações
            renderInPortal={false}
            flyoutStyle={{
              stroke: 0,
              fill: ({ datum }) => datum.color
            }}
          />
        }
      />
        <Text style={styles.totalExpenses}>R$ {totalExpenses.toFixed(2).replace('.', ',')}</Text>
    
        <FlatList
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
    color: colors.white_100,
    fontSize: 20,
    marginLeft: 10,
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  totalExpenses: {
    marginTop: -30,
    fontFamily: 'Outfit_400Regular',
    color: colors.white_100,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#1D222C',
    borderRadius: 25,
  }
});

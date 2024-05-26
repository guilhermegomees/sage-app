import { useState, useEffect } from 'react';
import { FlatList } from 'react-native';

import { EXPENSES } from '../../utils/expenses';

import { Card, CardProps } from '../components/Card';
import { Header, MonthsProps } from '../components/Header';

import { Container, Chart } from './styles';

import { VictoryPie, VictoryTooltip } from "victory-native";

export default function GraphicTeste() {
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
    
    <Container>
      <Header
        onValueChange={setMonth}
        selectedValue={month}
      />

      <Chart>
      <VictoryPie
        data={data}
        x="label"
        y="value"
        colorScale={data.map(expense => expense.color)} //Pegar escala de cor de cada item
        innerRadius={90} //Adicionar um Circulo no meio
        animate={{
          easing: "exp"
        }}
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
      </Chart>

      <FlatList
        data={EXPENSES[month]}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card
            data={item}
            selected={false}
            onPress={() => handleCardOnPress(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}

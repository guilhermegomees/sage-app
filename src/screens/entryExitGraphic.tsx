import React, { useEffect, useState } from 'react';
import { VictoryChart, VictoryLabel, VictoryTheme, VictoryBar } from 'victory-native';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  colors,
  base,
  Image,
  MaterialIcons,
  useNavigation,
  StackNavigationProp,
} from '~/imports';

import { TypeScreem } from '~/enums';
import { ITransaction } from '~/interfaces';
import BottomSheet from '~/components/BottomSheet';

type EntryExitGraphicScreenNavigationProp = StackNavigationProp<any, 'EntryExitGraphic'>;

export default function EntryExitGraphic() {
  const navigation = useNavigation<EntryExitGraphicScreenNavigationProp>();

  const handleNavigateToBack = () => {
    navigation.navigate('Graphic');
  };

  const data = [
    { x: 'Dez 23', y: 35 },
    { x: 'Jan 24', y: 40 },
    { x: 'Fev 24', y: 55 },
  ];

  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>([]);

  const fetchTransactions = async (): Promise<void> => {
    //TODO: Trazer transações através do banco e popular o data
    const data: ITransaction[] = [
      {
        DATE: '2024-03-04T03:00:00.000Z',
        DESCRIPTION: 'Compra em supermercado',
        ICON: 'shopping-cart',
        ID: 1,
        IS_EXPENSE: 1,
        VALUE: 150.75,
        WALLET: 1,
      },
      {
        DATE: '2024-03-04T03:00:00.000Z',
        DESCRIPTION: 'Pagamento de conta de luz',
        ICON: 'bolt',
        ID: 2,
        IS_EXPENSE: 1,
        VALUE: 80.5,
        WALLET: 1,
      },
      {
        DATE: '2024-03-08T03:00:00.000Z',
        DESCRIPTION: 'Jantar em restaurante',
        ICON: 'utensils',
        ID: 3,
        IS_EXPENSE: 1,
        VALUE: 65.3,
        WALLET: 1,
      },
      {
        DATE: '2024-03-10T03:00:00.000Z',
        DESCRIPTION: 'Compra online',
        ICON: 'shopping-bag',
        ID: 4,
        IS_EXPENSE: 1,
        VALUE: 200.0,
        WALLET: 1,
      },
      {
        DATE: '2024-03-12T03:00:00.000Z',
        DESCRIPTION: 'Compra em loja de roupas',
        ICON: 'tshirt',
        ID: 7,
        IS_EXPENSE: 1,
        VALUE: 100.0,
        WALLET: 1,
      },
      {
        DATE: '2024-03-15T03:00:00.000Z',
        DESCRIPTION: 'Assinatura de serviço online',
        ICON: 'subscription',
        ID: 8,
        IS_EXPENSE: 1,
        VALUE: 15.99,
        WALLET: 1,
      },
    ];

    setTransactions(data);
    setFilteredTransactions(data);
  };
  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <View style={[styles.container, base.flex_1]}>
      <View style={[styles.containerBack]}>
        <TouchableOpacity onPress={handleNavigateToBack}>
          <MaterialIcons name="chevron-left" size={30} color={colors.white_100} />
        </TouchableOpacity>
        <Text style={[styles.title]}>Entrada e Saída</Text>
      </View>
      <View style={styles.chartContainer}>
        <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
          <VictoryBar style={{ data: { fill: '#c43a31' } }} data={data} />
        </VictoryChart>
        <BottomSheet data={filteredTransactions} type={TypeScreem.Transaction} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});

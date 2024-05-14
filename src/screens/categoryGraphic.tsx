import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  colors,
  base,
  Image,
  MaterialIcons,
  StackNavigationProp
} from '~/imports';

import { TypeScreem } from '~/enums';
import { ITransaction } from '~/interfaces';
import BottomSheet from '~/components/BottomSheet';

import { useNavigation } from '@react-navigation/native';
import { VictoryPie, VictoryLabel } from 'victory-native';

type CategoryGraphicScreenNavigationProp = StackNavigationProp<any, 'CategoryGraphic'>;

export default function CategoryGraphic() {
  const navigation = useNavigation<CategoryGraphicScreenNavigationProp>();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<{ x: string; y: number; }[]>([]);

  const handleNavigateToBack = () => {
    navigation.navigate('Graphic');
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (): Promise<void> => {
    //TODO: Trazer transações através do banco e popular o data
    const data: ITransaction[] = [
      {
        DATE: '2024-01-03T03:00:00.000Z',
        CATEGORY: "Alimentação",
        DESCRIPTION: 'Compra em supermercado',
        ICON: 'shopping-cart',
        ID: 1,
        IS_EXPENSE: 1,
        VALUE: 150.75,
        WALLET: 1,
      },
      {
        DATE: '2024-03-03T03:00:00.000Z',
        DESCRIPTION: 'Jantar em restaurante',
        CATEGORY: "Alimentação",
        ICON: 'utensils',
        ID: 3,
        IS_EXPENSE: 1,
        VALUE: 65.3,
        WALLET: 1,
      },
      {
        DATE: '2024-12-3T03:00:00.000Z',
        DESCRIPTION: 'Compra online',
        CATEGORY: "Compra Online",
        ICON: 'shopping-bag',
        ID: 4,
        IS_EXPENSE: 1,
        VALUE: 200.0,
        WALLET: 1,
      },
      {
        DATE: '2024-11-2T03:00:00.000Z',
        DESCRIPTION: 'Compra em loja de roupas',
        CATEGORY: "Vestuário",
        ICON: 'tshirt',
        ID: 7,
        IS_EXPENSE: 1,
        VALUE: 100.0,
        WALLET: 1,
      },
      {
        DATE: '2024-10-01T03:00:00.000Z',
        DESCRIPTION: 'Assinatura de serviço online',
        CATEGORY: "Compra Online",
        ICON: 'subscription',
        ID: 8,
        IS_EXPENSE: 1,
        VALUE: 15.99,
        WALLET: 1,
      },
    ];
  
    setTransactions(data);
    const groupedData = groupTransactionsByCategory(data); // Agrupa as transações por categoria
    console.log('groupedData:', groupedData); // Adicione esta linha para verificar o conteúdo de groupedData
    setFilteredTransactions(groupedData); // Define as transações agrupadas no estado
  };

  const groupTransactionsByCategory = (data: ITransaction[]): { x: string, y: number }[] => {
    const groupedData: { [key: string]: number } = {};
  
    data.forEach(transaction => {
      if (transaction.CATEGORY in groupedData) {
        groupedData[transaction.CATEGORY] += transaction.VALUE;
      } else {
        groupedData[transaction.CATEGORY] = transaction.VALUE;
      }
    });
  
    return Object.keys(groupedData).map(category => ({
      x: category,
      y: groupedData[category]
    }));
  };
  
  return (
    <View style={[styles.container, base.flex_1]}>
      <View style={[styles.containerBack]}>
        <TouchableOpacity onPress={handleNavigateToBack}>
          <MaterialIcons name="chevron-left" size={30} color={colors.white_100} />
        </TouchableOpacity>
        <Text style={[styles.title]}>Transação por categoria</Text>
      </View>
      <View style={styles.chartContainer}>
        <VictoryPie
          width={300}
          height={300}
          innerRadius={75}
          data={filteredTransactions} // Passamos os dados agrupados para o VictoryPie
          colorScale={["tomato", "cyan", "gold"]}
          labelComponent={<VictoryLabel style={{ fill: colors.white_100, fontSize: 15, fontFamily: 'Outfit_600SemiBold' }} />}
        />
        <BottomSheet data={transactions} type={TypeScreem.Graphics} />
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

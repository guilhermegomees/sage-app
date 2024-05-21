import React, { useEffect, useState } from 'react';
import { VictoryPie, VictoryLabel } from 'victory-native';
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

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (): Promise<void> => {
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
        CATEGORY: "Alimentação2",
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
    const groupedData = groupTransactionsByCategory(data);
    setFilteredTransactions(groupedData);
    const total = calculateTotalExpenses(data);
    setTotalExpenses(total);
  };

  const groupTransactionsByCategory = (data: ITransaction[]): { x: string, y: number, z: string }[] => {
    const groupedData: { [key: string]: number } = {};
  
    data.forEach(transaction => {
      if (transaction.CATEGORY in groupedData) {
        groupedData[transaction.CATEGORY] += transaction.VALUE;
      } else {
        groupedData[transaction.CATEGORY] = transaction.VALUE;
      }
    });
  
    return Object.keys(groupedData).map(category => ({
      x: " ",  // Gambiarra não exibir valor do grafico.
      y: groupedData[category],
      z: category  // Mantendo a categoria original em z
    }));
  };

  const calculateTotalExpenses = (data: ITransaction[]): number => {
    return data.filter(transaction => transaction.IS_EXPENSE === 1).reduce((total, transaction) => total + transaction.VALUE, 0);
  };

  const handleSliceClick = (event: any, props: any) => {
    const index = props.index;
    const category = filteredTransactions[index].z;
    const total = filteredTransactions[index].y;
    const descriptions = transactions.filter(transaction => transaction.CATEGORY === category).map(transaction => transaction.DESCRIPTION).join(", ");
    setSelectedCategory({ category, total, description: descriptions });
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
          data={filteredTransactions}
          colorScale={["tomato", "cyan", "gold", "silver"]}
          events={[
            {
              target: "data",
              eventHandlers: {
                onPressIn: (event, props) => {
                  handleSliceClick(event, props);
                  return [];
                }
              }
            }
          ]}
          labelComponent={<VictoryLabel textAnchor="middle" verticalAnchor="middle" />}
        />
        <VictoryLabel
          text={selectedCategory ? `Total: R$ ${selectedCategory.total.toFixed(2).replace('.', ',')}\n${selectedCategory.description}` : ""}
          textAnchor="middle"
          verticalAnchor="middle"
          x={150}
          y={150}
          style={{ fontFamily: 'Outfit_400Regular', fontSize: 16, fill: 'white' }}
        />
        <Text style={styles.totalExpenses}>R$ {totalExpenses.toFixed(2).replace('.', ',')}</Text>
        {selectedCategory && (
          <View style={styles.selectedCategoryContainer}>
            <Text style={styles.selectedCategoryText}>
              Categoria: {selectedCategory.category}
            </Text>
            <Text style={styles.selectedCategoryText}>
              Total: R$ {selectedCategory.total.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        )}
        <BottomSheet data={transactions} type={TypeScreem.Graphics}/>
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
  totalExpenses: {
    marginTop: -30,
    fontFamily: 'Outfit_400Regular',
    color: colors.white_100,
    fontSize: 16,
  },
  selectedCategoryContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  selectedCategoryText: {
    fontFamily: 'Outfit_400Regular',
    color: colors.white_100,
    fontSize: 16,
    textAlign: 'center',
  },
});

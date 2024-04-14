import React, {useEffect, useState} from 'react';
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
  const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>([]);

  const handleNavigateToBack = () => {
    navigation.navigate('Graphic');
  };

  //TODO ajustar DATA para trazer dados da base de dados.
  const data = [
    { x: 1, y: 2, label: "one" },
    { x: 2, y: 3, label: "two" },
    { x: 3, y: 5, label: "three" }
  ];

  const fetchTransactions = async (): Promise<void> => {
    //TODO: Trazer transações através do banco e popular o data
    const data: ITransaction[] = [
        { "DATE": "2024-03-04T03:00:00.000Z", "DESCRIPTION": "Compra em supermercado", "ICON": "shopping-cart", "ID": 1, "IS_EXPENSE": 1, "VALUE": 150.75, "WALLET": 1 },
        { "DATE": "2024-03-04T03:00:00.000Z", "DESCRIPTION": "Pagamento de conta de luz", "ICON": "bolt", "ID": 2, "IS_EXPENSE": 1, "VALUE": 80.50, "WALLET": 1 },
        { "DATE": "2024-03-08T03:00:00.000Z", "DESCRIPTION": "Jantar em restaurante", "ICON": "utensils", "ID": 3, "IS_EXPENSE": 1, "VALUE": 65.30, "WALLET": 1 },
        { "DATE": "2024-03-10T03:00:00.000Z", "DESCRIPTION": "Compra online", "ICON": "shopping-bag", "ID": 4, "IS_EXPENSE": 1, "VALUE": 200.00, "WALLET": 1 },
        { "DATE": "2024-03-12T03:00:00.000Z", "DESCRIPTION": "Compra em loja de roupas", "ICON": "tshirt", "ID": 7, "IS_EXPENSE": 1, "VALUE": 100.00, "WALLET": 1 },
        { "DATE": "2024-03-15T03:00:00.000Z", "DESCRIPTION": "Assinatura de serviço online", "ICON": "subscription", "ID": 8, "IS_EXPENSE": 1, "VALUE": 15.99, "WALLET": 1 }
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
        <Text style={[styles.title]}>Transação por categoria</Text>
      </View>
      <View style={styles.chartContainer}>
        <VictoryPie
          width={300}
          height={300}
          innerRadius={75}
          data={data}
          colorScale={["tomato", "cyan", "gold"]}
          labelComponent={<VictoryLabel style={{ fill: colors.white_100, fontSize: 15, fontFamily: 'Outfit_600SemiBold' }} />}
        />
        <BottomSheet data={filteredTransactions} type={TypeScreem.Transaction} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray_900,
    paddingHorizontal: 20,
    flex: 1,},
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

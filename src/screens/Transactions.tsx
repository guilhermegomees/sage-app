import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '~/components/BottomSheet';
import SearchBar from '~/components/SearchBar';
import base from '~/css/base';
import colors from '~/css/colors';
import { TypeScreem } from '~/enums/enums';
import { ITransaction } from '~/interfaces/interfaces';

export default function Transactions() {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>([]);

    const fetchTransactions = async (): Promise<void> => {
        //TODO: Trazer transações através do banco e popular o data
        const data: ITransaction[] = [
            { id: 1, date: "2024-03-04T03:00:00.000Z", description: "Compra em supermercado", icon: "shopping-cart", isExpense: 1, value: 151.75, wallet: 1 },
            { id: 2, date: "2024-03-04T03:00:00.000Z", description: "Pagamento de conta de luz", icon: "bolt", isExpense: 1, value: 80.50, wallet: 1 },
            { id: 3, date: "2024-03-08T03:00:00.000Z", description: "Jantar em restaurante", icon: "utensils", isExpense: 1, value: 65.30, wallet: 1 },
            { id: 4, date: "2024-03-10T03:00:00.000Z", description: "Compra online", icon: "shopping-bag", isExpense: 1, value: 200.00, wallet: 1 },
            { id: 5, date: "2024-03-12T03:00:00.000Z", description: "Pagamento de fatura", icon: "credit-card", isExpense: 1, value: 600.00, wallet: 1 },
            { id: 6, date: "2024-03-12T03:00:00.000Z", description: "Reembolso de compra", icon: "money-check-alt", isExpense: 0, value: 50.00, wallet: 1 },
            { id: 7, date: "2024-03-12T03:00:00.000Z", description: "Compra em loja de roupas", icon: "tshirt", isExpense: 1, value: 120.00, wallet: 1 },
            { id: 8, date: "2024-03-15T03:00:00.000Z", description: "Assinatura de serviço online", icon: "star", isExpense: 1, value: 15.99, wallet: 1 },
            { id: 9, date: "2024-03-12T03:00:00.000Z", description: "Reembolso de compra", icon: "money-check-alt", isExpense: 0, value: 50.00, wallet: 1 },
            { id: 10, date: "2024-03-12T03:00:00.000Z", description: "Compra em loja de roupas", icon: "tshirt", isExpense: 1, value: 120.00, wallet: 1 },
            { id: 11, date: "2024-03-15T03:00:00.000Z", description: "Assinatura de serviço online", icon: "star", isExpense: 1, value: 15.99, wallet: 1 }
        ];

        setTransactions(data);
        setFilteredTransactions(data);
    };

    const convertToDate = (timeObject: { seconds: number; nanoseconds: number }): Date => {
        const { seconds, nanoseconds } = timeObject;
        
        const millisecondsFromSeconds = seconds * 1000;
        
        const millisecondsFromNanoseconds = nanoseconds / 1_000_000;
        
        const totalMilliseconds = millisecondsFromSeconds + millisecondsFromNanoseconds;
        
        return new Date(totalMilliseconds);

      };

    const fetchTransactionsFromFirebase = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "transaction"));
          const data: ITransaction[] = querySnapshot.docs.map(doc => {
            const transactionData = doc.data();
            
            // Verifica se transactionData.date existe e é um Timestamp
            let dateString = '';
            if (transactionData.date && typeof transactionData.date.toDate === 'function') {
                dateString = new Date(transactionData.date.toDate()).toISOString();
            } else {
                console.warn("Documento sem campo 'date' válido ou 'date' não é um Timestamp:", doc.id); 
            }
            console.log(transactionData.date);
            return {
              id: transactionData.id || 0, 
              date: convertToDate(transactionData.date),
              description: transactionData.description || '', 
              icon: transactionData.icon || '',
              isExpense: transactionData.isExpense ? 1 : 0,
              value: transactionData.value || 0,
              wallet: transactionData.wallet || 0
            };
          });
      
          console.log(data);
          
      
          setTransactions(data);
          setFilteredTransactions(data);
        } catch (error) {
          console.error("Erro ao buscar transações do Firebase: ", error);
        }
      };

    useEffect(() => {
        // fetchTransactions();
        fetchTransactionsFromFirebase();
    }, []);

    const handleSearch = (text: string) => {
        const filtered: ITransaction[] = transactions.filter((transaction: ITransaction) =>
            transaction.description.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredTransactions(filtered);
    };

    const renderItem = ({ item }: { item: ITransaction }) => (
        <View style={styles.transactionItem}> 
            <Text>{item.description}</Text> 
            <Text>{item.value.toString()}</Text> {/* Certifique-se de converter o valor para string */}
            {/* Adicione mais elementos Text para exibir outros detalhes */}
        </View>
    );


    return (
        <View style={[styles.container]}>
            <View style={[base.mb_20, base.mt_25, base.mx_2]}>
                <SearchBar onSearch={handleSearch} />
            </View>
            <BottomSheet data={filteredTransactions} type={TypeScreem.Transaction} />
            {/* <FlatList // Use o FlatList para renderizar a lista de transações
                data={filteredTransactions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()} 
            /> */}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray_900,
        paddingHorizontal: 20
    },
    containerBack: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 25,
    },
    titleTransactions: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.gray_50,
        fontSize: 20,
        marginTop: 2
    },
    buttonAdd: {
        borderRadius: 10,
        backgroundColor: colors.blue_600,
        padding: 7
    },
    textButtonAdd : {
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_50
    },
    transactionItem: {
        // Adicione estilos para cada item da lista de transações
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    }
})

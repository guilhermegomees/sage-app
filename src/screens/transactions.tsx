import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    colors,
    base,
    MaterialIcons,
    useNavigation,
    StackNavigationProp
} from '~/imports';

import { TypeScreem } from '~/enums';
import { ITransaction } from '~/interfaces';

import BottomSheet from '~/components/BottomSheet';
import SearchBar from '~/components/SearchBar';

type TransactionsScreenNavigationProp = StackNavigationProp<any, 'Transactions'>;

export default function Transactions() {
    const navigation = useNavigation<TransactionsScreenNavigationProp>();
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>([]);

    const handleNavigateToBack = () => {
        navigation.navigate('Home');
    };

    const fetchTransactions = async (): Promise<void> => {
        //TODO: Trazer transações através do banco e popular o data
        const data: ITransaction[] = [
            { "DATE": "2024-03-04T03:00:00.000Z", "DESCRIPTION": "Compra em supermercado", "ICON": "shopping-cart", "ID": 1, "IS_EXPENSE": 1, "VALUE": 150.75, "WALLET": 1 },
            { "DATE": "2024-03-04T03:00:00.000Z", "DESCRIPTION": "Pagamento de conta de luz", "ICON": "bolt", "ID": 2, "IS_EXPENSE": 1, "VALUE": 80.50, "WALLET": 1 },
            { "DATE": "2024-03-08T03:00:00.000Z", "DESCRIPTION": "Jantar em restaurante", "ICON": "utensils", "ID": 3, "IS_EXPENSE": 1, "VALUE": 65.30, "WALLET": 1 },
            { "DATE": "2024-03-10T03:00:00.000Z", "DESCRIPTION": "Compra online", "ICON": "shopping-bag", "ID": 4, "IS_EXPENSE": 1, "VALUE": 200.00, "WALLET": 1 },
            { "DATE": "2024-03-12T03:00:00.000Z", "DESCRIPTION": "Pagamento de fatura", "ICON": "credit-card", "ID": 5, "IS_EXPENSE": 0, "VALUE": 600.00, "WALLET": 1 },
            { "DATE": "2024-03-12T03:00:00.000Z", "DESCRIPTION": "Reembolso de compra", "ICON": "money-check-alt", "ID": 6, "IS_EXPENSE": 0, "VALUE": 50.00, "WALLET": 1 },
            { "DATE": "2024-03-12T03:00:00.000Z", "DESCRIPTION": "Compra em loja de roupas", "ICON": "tshirt", "ID": 7, "IS_EXPENSE": 1, "VALUE": 100.00, "WALLET": 1 },
            { "DATE": "2024-03-15T03:00:00.000Z", "DESCRIPTION": "Assinatura de serviço online", "ICON": "subscription", "ID": 8, "IS_EXPENSE": 1, "VALUE": 15.99, "WALLET": 1 },
            { "DATE": "2024-03-12T03:00:00.000Z", "DESCRIPTION": "Pagamento de fatura", "ICON": "credit-card", "ID": 9, "IS_EXPENSE": 0, "VALUE": 600.00, "WALLET": 1 },
            { "DATE": "2024-03-12T03:00:00.000Z", "DESCRIPTION": "Reembolso de compra", "ICON": "money-check-alt", "ID": 10, "IS_EXPENSE": 0, "VALUE": 50.00, "WALLET": 1 },
            { "DATE": "2024-03-12T03:00:00.000Z", "DESCRIPTION": "Compra em loja de roupas", "ICON": "tshirt", "ID":11, "IS_EXPENSE": 1, "VALUE": 100.00, "WALLET": 1 },
            { "DATE": "2024-03-15T03:00:00.000Z", "DESCRIPTION": "Assinatura de serviço online", "ICON": "subscription", "ID": 12, "IS_EXPENSE": 1, "VALUE": 15.99, "WALLET": 1 }
        ];

        setTransactions(data);
        setFilteredTransactions(data);
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleSearch = (text: string) => {
        const filtered: ITransaction[] = transactions.filter((transaction: ITransaction) =>
            transaction.DESCRIPTION.toLowerCase().startsWith(text.toLowerCase())
        );
        setFilteredTransactions(filtered);
    };

    return (
        <View style={[styles.container]}>
            <View style={[styles.containerBack]}>
                <View style={[base.flexRow, base.gap_8]}>
                    <TouchableOpacity onPress={handleNavigateToBack}>
                        <MaterialIcons name="chevron-left" size={30} color={colors.white_100} />
                    </TouchableOpacity>
                    <Text style={[styles.titleTransactions]}>Transações</Text>
                </View>
                <TouchableOpacity style={[styles.buttonAdd]}>
                    <Text style={[styles.textButtonAdd]}>Adicionar</Text>
                </TouchableOpacity>
            </View>
            <View style={[base.mb_20, base.mx_2]}>
                <SearchBar onSearch={handleSearch} />
            </View>
            <BottomSheet data={filteredTransactions} type={TypeScreem.Transaction} />
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
        color: colors.white_100,
        fontSize: 20,
        marginTop: 2
    },
    buttonAdd: {
        borderRadius: 10,
        backgroundColor: colors.blue_100,
        padding: 7
    },
    textButtonAdd : {
        fontFamily: 'Outfit_500Medium',
        color: colors.white_100
    }
})
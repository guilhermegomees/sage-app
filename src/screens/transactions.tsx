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
    const [data, setData] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);

    const handleNavigateToBack = () => {
        navigation.navigate('Home');
    };

    const fetchData = async (): Promise<any> => {
        //TODO: Trazer transações através do banco e popular o data
        const data = [
            { "DATE": "2024-03-04T03:00:00.000Z", "DESCRIPTION": "Compra em supermercado", "ICON": "shopping-cart", "ID": 1, "IS_EXPENSE": 1, "VALUE": 150.75, "WALLET": 1 },
            { "DATE": "2024-03-04T03:00:00.000Z", "DESCRIPTION": "Pagamento de conta de luz", "ICON": "bolt", "ID": 2, "IS_EXPENSE": 1, "VALUE": 80.50, "WALLET": 1 },
            { "DATE": "2024-03-08T03:00:00.000Z", "DESCRIPTION": "Jantar em restaurante", "ICON": "utensils", "ID": 3, "IS_EXPENSE": 1, "VALUE": 65.30, "WALLET": 1 },
            { "DATE": "2024-03-10T03:00:00.000Z", "DESCRIPTION": "Compra online", "ICON": "shopping-bag", "ID": 4, "IS_EXPENSE": 1, "VALUE": 200.00, "WALLET": 1 },
            { "DATE": "2024-03-12T03:00:00.000Z", "DESCRIPTION": "Pagamento de fatura", "ICON": "credit-card", "ID": 5, "IS_EXPENSE": 0, "VALUE": 600.00, "WALLET": 1 },
            { "DATE": "2024-03-12T03:00:00.000Z", "DESCRIPTION": "Reembolso de compra", "ICON": "money-check-alt", "ID": 6, "IS_EXPENSE": 0, "VALUE": 50.00, "WALLET": 1 },
            { "DATE": "2024-03-12T03:00:00.000Z", "DESCRIPTION": "Compra em loja de roupas", "ICON": "tshirt", "ID": 7, "IS_EXPENSE": 1, "VALUE": 100.00, "WALLET": 1 },
            { "DATE": "2024-03-15T03:00:00.000Z", "DESCRIPTION": "Assinatura de serviço online", "ICON": "subscription", "ID": 8, "IS_EXPENSE": 1, "VALUE": 15.99, "WALLET": 1 }
        ];

        setData(data);
        setFilteredData(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (text: string) => {
        setSearchText(text);
        const filtered: any = data.filter((transaction: ITransaction) =>
            transaction.DESCRIPTION.toLowerCase().startsWith(text.toLowerCase())
        );
        setFilteredData(filtered);
        setShowNoResultsMessage(filtered.length === 0);
    };

    return (
        <View style={[styles.container]}>
            <View style={[styles.containerBack]}>
                <TouchableOpacity onPress={handleNavigateToBack}>
                    <MaterialIcons name="chevron-left" size={30} color={colors.white_100} />
                </TouchableOpacity>
                <Text style={[styles.titleTransactions]}>Transações</Text>
            </View>

            <View style={[base.mb_20, base.mx_2]}>
                <SearchBar onSearch={handleSearch} />
            </View>

            <BottomSheet data={filteredData} type={TypeScreem.Transaction} />
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
        marginTop: 30,
        marginBottom: 25,
    },
    titleTransactions: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.white_100,
        fontSize: 20,
        marginLeft: 10,
    },
})
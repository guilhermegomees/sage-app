import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BottomSheet from '~/components/BottomSheet';
import SearchBar from '~/components/SearchBar';
import { useTransactions } from '~/context/TransactionContext';
import base from '~/css/base';
import colors from '~/css/colors';
import { TypeScreem } from '~/enums/enums';
import useUser from '~/hooks/useUser';

export default function Transactions() {
    const user = useUser();
    const [searchTransaction, setSearchTransaction] = useState<string>('');
    const { transactions, fetchTransactions } = useTransactions();

    useEffect(() => {
        if (user) fetchTransactions(user);
    }, [user]);

    const filteredTransactions = transactions.filter(transaction => 
        transaction.description.toLowerCase().includes(searchTransaction.toLowerCase())
    );

    return (
        <View style={[styles.container]}>
            <View style={[base.mb_20, base.mt_25, base.mx_2]}>
                <SearchBar searchValue={searchTransaction} setSearchValue={setSearchTransaction} />
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
    }
})

import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BottomSheet from '~/components/BottomSheet';
import SearchBar from '~/components/SearchBar';
import { db } from '~/config';
import base from '~/css/base';
import colors from '~/css/colors';
import { TypeScreem } from '~/enums/enums';
import { ITransaction } from '~/interfaces/interfaces';

export default function Transactions() {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [searchTransaction, setSearchTransaction] = useState<string>('');

    const transactionCollectionRef = collection(db, "transaction");

    const convertToDate = (timeObject: { seconds: number; nanoseconds: number }): Date => {
        const { seconds, nanoseconds } = timeObject;
        
        const millisecondsFromSeconds = seconds * 1000;
        const millisecondsFromNanoseconds = nanoseconds / 1_000_000;
        const totalMilliseconds = millisecondsFromSeconds + millisecondsFromNanoseconds;
        
        return new Date(totalMilliseconds);
    };

    const fetchTransactions = async (): Promise<void> => {
        try {
            const querySnapshot = await getDocs(transactionCollectionRef);
            const data: ITransaction[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                description: doc.data().description,
                date: convertToDate(doc.data().date),
                category: doc.data().category,
                isExpense: doc.data().isExpense,
                value: doc.data().value,
                account: doc.data().account,
                user: doc.data().user
            }));

            setTransactions(data);
        } catch (error) {
            console.error("Erro ao buscar transações: ", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

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

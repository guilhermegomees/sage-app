import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ITransaction, IUser } from '~/interfaces/interfaces';
import { db } from '~/config/firebase';
import useUser from '~/hooks/useUser';

type TransactionContextType = {
    transactions: ITransaction[];
    fetchTransactions: (user: IUser) => Promise<void>;
};

const TransactionContext = createContext<TransactionContextType | null>(null);

export const TransactionProvider = ({ children } : { children: React.ReactNode }) => {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);

    const transactionCollectionRef = collection(db, "transaction");

    const convertToDate = (timeObject: { seconds: number; nanoseconds: number }): Date => {
        const { seconds, nanoseconds } = timeObject;

        const millisecondsFromSeconds = seconds * 1000;
        const millisecondsFromNanoseconds = nanoseconds / 1_000_000;
        const totalMilliseconds = millisecondsFromSeconds + millisecondsFromNanoseconds;

        return new Date(totalMilliseconds);
    };

    const fetchTransactions = async (user: IUser): Promise<void> => {
        try {
            const q = query(transactionCollectionRef, where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const data: ITransaction[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                description: doc.data().description,
                date: convertToDate(doc.data().date),
                category: doc.data().category,
                isExpense: doc.data().isExpense,
                source: doc.data().source,
                value: doc.data().value,
                account: doc.data().account,
                uid: doc.data().uid
            }));
            
            setTransactions(data);
        } catch (error) {
            console.error("Erro ao buscar transações: ", error);
        }
    };

    return (
        <TransactionContext.Provider value={{ transactions, fetchTransactions }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};
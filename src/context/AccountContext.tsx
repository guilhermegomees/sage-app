import React, { createContext, useContext, useState } from 'react';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '~/config/firebase';
import { IAccount, IUser } from '~/interfaces/interfaces';

type AccountContextType = {
    accounts: IAccount[];
    totalValue: number,
    totalValueWithoutFilter: number,
    fetchAccounts: (user: IUser) => Promise<void>;
    updateAccountBalance: (accountId: string, amount: number) => Promise<void>;
};

const AccountContext = createContext<AccountContextType | null>(null);

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
    const [accounts, setAccounts] = useState<IAccount[]>([]);
    const [totalValue, setTotalValue] = useState<number>(0);
    const [totalValueWithoutFilter, setTotalValueWithoutFilter] = useState<number>(0);
    const accountCollectionRef = collection(db, "account");

    const fetchAccounts = async (user: IUser): Promise<void> => {
        try {
            const q = query(accountCollectionRef, where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const data: IAccount[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as IAccount[];

            const totalValueWithoutFilter = data
            .reduce((acc, account) => {
                const numericValue = account.balance;
                return acc + numericValue;
            }, 0);

            const totalValue = data
            .filter(account => account.includeInSum)
            .reduce((acc, account) => {
                const numericValue = account.balance;
                return acc + numericValue;
            }, 0);

            setTotalValue(totalValue);
            setTotalValueWithoutFilter(totalValueWithoutFilter)
            setAccounts(data);
        } catch (error) {
            console.error("Erro ao buscar contas: ", error);
        }
    };

    const updateAccountBalance = async (accountId: string, amount: number): Promise<void> => {
        try {
            const accountRef = doc(db, "account", accountId);
            await updateDoc(accountRef, { balance: amount });
        } catch (error) {
            console.error("Erro ao atualizar saldo da conta: ", error);
        }
    };

    return (
        <AccountContext.Provider value={{ accounts, totalValue, totalValueWithoutFilter, fetchAccounts, updateAccountBalance }}>
            {children}
        </AccountContext.Provider>
    );
};

export const useAccounts = () => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error('useAccounts must be used within an AccountProvider');
    }
    return context;
};
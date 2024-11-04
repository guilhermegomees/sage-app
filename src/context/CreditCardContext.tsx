import React, { createContext, useContext, useState } from 'react';
import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { ICreditCard, IInvoice, IUser } from '~/interfaces/interfaces';
import { db } from '~/config/firebase';

type CreditCardContextType = {
    creditCards: ICreditCard[];
    fetchCreditCards: (user: IUser, id?: string) => Promise<void>;
};

const CreditCardContext = createContext<CreditCardContextType | null>(null);

export const CreditCardsProvider = ({ children } : { children: React.ReactNode }) => {
    const [creditCards, setCreditCards] = useState<ICreditCard[]>([]);

const creditCardCollectionRef = collection(db, "creditCard");

const fetchCreditCards = async (user: IUser, id?: string): Promise<void> => {
    try {
        const q = id
            ? query(creditCardCollectionRef, where("uid", "==", user.uid), where(documentId(), "==", id))
            : query(creditCardCollectionRef, where("uid", "==", user.uid));
            
        const querySnapshot = await getDocs(q);
        
        // Para cada cartão, busque a subcoleção `invoices`
        const creditCardsData: ICreditCard[] = await Promise.all(
            querySnapshot.docs.map(async (cardDoc) => {
                const cardData = { 
                    id: cardDoc.id, 
                    ...cardDoc.data() 
                } as ICreditCard;

                // Referência para a subcoleção `invoices`
                const invoicesRef = collection(db, `creditCard/${cardDoc.id}/invoices`);
                const invoicesSnapshot = await getDocs(invoicesRef);

                const invoices = invoicesSnapshot.docs.map(invoiceDoc => ({
                    id: invoiceDoc.id,
                    ...invoiceDoc.data(),
                    month: invoiceDoc.data().month,
                    totalAmount: invoiceDoc.data().totalAmount,
                    isPaid: invoiceDoc.data().isPaid,
                    paymentDate: invoiceDoc.data().paymentDate || null,
                })) as IInvoice[];

                return { ...cardData, invoices };
            })
        );

        setCreditCards(creditCardsData);
    } catch (error) {
        console.error("Erro ao buscar cartões: ", error);
    }
};

    return (
        <CreditCardContext.Provider value={{ creditCards, fetchCreditCards }}>
            {children}
        </CreditCardContext.Provider>
    );
};

export const useCreditCards = () => {
    const context = useContext(CreditCardContext);
    if (!context) {
        throw new Error('useCreditCards must be used within a CreditCardsProvider');
    }
    return context;
};
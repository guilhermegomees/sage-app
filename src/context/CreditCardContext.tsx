import React, { createContext, useContext, useState } from 'react';
import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { ICreditCard, IInvoice, IUser } from '~/interfaces/interfaces';
import { db } from '~/config/firebase';

type CreditCardContextType = {
    creditCards: ICreditCard[];
    creditCardDetails: ICreditCard | undefined;
    fetchCreditCards: (user: IUser, cardId?: string) => Promise<void>;
};

const CreditCardContext = createContext<CreditCardContextType | null>(null);

export const CreditCardsProvider = ({ children } : { children: React.ReactNode }) => {
    const [creditCards, setCreditCards] = useState<ICreditCard[]>([]);
    const [creditCardDetails, setCreditCardDetails] = useState<ICreditCard | undefined>();

    const creditCardCollectionRef = collection(db, "creditCard");

    const fetchCreditCards = async (user: IUser, cardId?: string): Promise<void> => {
        try {
            const q = cardId
                ? query(creditCardCollectionRef, where("uid", "==", user.uid), where(documentId(), "==", cardId))
                : query(creditCardCollectionRef, where("uid", "==", user.uid));
                
            const querySnapshot = await getDocs(q);
    
            const creditCardsData: ICreditCard[] = await Promise.all(
                querySnapshot.docs.map(async (cardDoc) => {
                    const cardData = { 
                        id: cardDoc.id, 
                        ...cardDoc.data() 
                    } as ICreditCard;
    
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
    
            cardId ? setCreditCardDetails(creditCardsData[0] || null) : setCreditCards(creditCardsData);
        } catch (error) {
            console.error("Erro ao buscar cartões: ", error);
        }
    };    

    return (
        <CreditCardContext.Provider value={{ creditCards, creditCardDetails, fetchCreditCards }}>
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
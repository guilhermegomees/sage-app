import React, { createContext, useContext, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { IGoal, IUser } from '~/interfaces/interfaces';
import { db } from '~/config/firebase';

type GoalContextType = {
    goals: IGoal[];
    fetchGoals: (user: IUser) => Promise<void>;
};

const GoalContext = createContext<GoalContextType | null>(null);

export const GoalProvider = ({ children } : { children: React.ReactNode }) => {
    const [goals, setGoals] = useState<IGoal[]>([]);

    const goalCollectionRef = collection(db, "goal");

    const fetchGoals = async (): Promise<void> => {
        try {
            const querySnapshot = await getDocs(goalCollectionRef);
            const data: IGoal[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                initialValue: doc.data().initialValue,
                goalValue: doc.data().goalValue,
                currentValue: doc.data().currentValue,
                icon: doc.data().icon,
                color: doc.data().color,
                isCompleted: doc.data().isCompleted,
                endDate: doc.data().endDate
            }));
            
            setGoals(data);
        } catch (error) {
            console.error("Erro ao buscar metas: ", error);
        }
    };

    return (
        <GoalContext.Provider value={{ goals, fetchGoals }}>
            {children}
        </GoalContext.Provider>
    );
};

export const useGoals = () => {
    const context = useContext(GoalContext);
    if (!context) {
        throw new Error('useGoals must be used within a GoalProvider');
    }
    return context;
};

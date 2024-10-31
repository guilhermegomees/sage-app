import React, { createContext, useContext, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { IGoal } from '~/interfaces/interfaces';
import { db } from '~/config/firebase';

type GoalContextType = {
    goals: IGoal[];
    fetchGoals: () => Promise<void>;
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
                currentValue: doc.data().currentValue,
                goalValue: doc.data().goalValue,
                icon: doc.data().icon,
                isCompleted: doc.data().isCompleted,
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

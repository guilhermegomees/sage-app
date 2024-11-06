import React, { createContext, useContext, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { IGoal, IUser } from '~/interfaces/interfaces';
import { db } from '~/config/firebase';

type ProfileContextType = {
    profileInfo: IUser[];
    profilePicture: string;
    setProfilePicture: React.Dispatch<React.SetStateAction<string>>;
    fetchProfileInfo: (user: IUser) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({ children } : { children: React.ReactNode }) => {
    const [profileInfo, setProfileInfo] = useState<IUser[]>([]);
    const [profilePicture, setProfilePicture] = useState<string>('');

    const profileCollectionRef = collection(db, "user");

    const fetchProfileInfo = async (user: IUser): Promise<void> => {
        try {
            const q = query(profileCollectionRef, where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const data: IUser[] = querySnapshot.docs.map(doc => ({
                uid: doc.data().uid,
                name: doc.data().name,
                email: doc.data().email,
                photoURL: doc.data().photoURL,
            }));
            
            setProfileInfo(data);
        } catch (error) {
            console.error("Erro ao buscar informações do perfil: ", error);
        }
    };

    return (
        <ProfileContext.Provider value={{ profileInfo, profilePicture, setProfilePicture, fetchProfileInfo }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a GoalProvider');
    }
    return context;
};
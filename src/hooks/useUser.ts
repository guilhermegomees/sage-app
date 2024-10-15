import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '~/config';
import { IUser } from '~/interfaces/interfaces';

const useUser = () => {
    const [user, setUser] = useState<IUser | null>(null); // Declare o tipo de estado

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setUser({ uid: currentUser.uid, ...userDoc.data() } as IUser);
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return user;
};

export default useUser;
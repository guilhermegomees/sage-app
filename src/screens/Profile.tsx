import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import useUser from '~/hooks/useUser';
import colors from '~/css/colors';
import { app } from '~/config/firebase';
import { FontAwesome6 } from '@expo/vector-icons';
import base from '~/css/base';
import { Circle } from 'react-native-progress';

type ProfileScreenNavigationProp = StackNavigationProp<any, 'Profile'>;

const Profile: React.FC = () => {
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const user = useUser();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    
    const auth = getAuth(app);
    const storage = getStorage(app);
    const firestore = getFirestore(app);
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                const userDocRef = doc(firestore, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const photoURL = userDoc.data()?.photoURL as string;
                    setProfileImage(photoURL);
                }
            }
        };

        fetchUserProfile();
    }, [user, firestore]);

    const uploadImage = async (uri: string): Promise<string> => {
        if (!user?.uid) throw new Error("Usuário não autenticado");
        
        // Converta a URI da imagem para um Blob
        const response = await fetch(uri);
        const blob = await response.blob();
        
        const filename = `images/${user.uid}`;
        const storageRef = ref(storage, filename);
        console.log(blob);
        // Fazer o upload do Blob para o Firebase Storage
        await uploadBytes(storageRef, blob);
        
        // Obter a URL de download
        return await getDownloadURL(storageRef);
    };
    

    const handleImagePick = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Precisamos da permissão para acessar suas fotos!');
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
    
        if (!result.canceled && result.assets?.[0].uri) {
            const uri = result.assets[0].uri;
            try {
                const imageUrl = await uploadImage(uri);
                
                // Atualizar o perfil do usuário no Firebase Auth
                if (auth.currentUser) {
                    await updateProfile(auth.currentUser, { photoURL: imageUrl });
                }
    
                // Salvar a URL da imagem no Firestore
                const userDocRef = doc(firestore, 'users', user?.uid || '');
                await setDoc(userDocRef, { photoURL: imageUrl }, { merge: true });
    
                setProfileImage(imageUrl);
            } catch (error) {
                console.error("Erro ao fazer upload da imagem:", error);
            }
        }
    };
    
    const handleNavigateToBack = () => {
        navigation.goBack();
    };

    const signOutUser = async () => {
        try {
            await signOut(auth);
            navigation.navigate('Login');
        } catch (error) {
            console.log("Erro ao deslogar:", error);
        }
    };    
    
    return (
        <View style={[base.flex_1, base.gap_50, { backgroundColor: colors.gray_900 }]}>
            <View style={styles.container}>
                <View style={[styles.containerBack]}>
                    <TouchableOpacity onPress={handleNavigateToBack}>
                        <FontAwesome6 name="angle-left" size={20} color={colors.gray_50} />
                    </TouchableOpacity>
                </View>
                <View style={[base.alignItemsCenter, base.gap_20]}>
                    <TouchableOpacity onPress={handleImagePick}>
                        <Image 
                            source={profileImage 
                                ? { uri: profileImage } 
                                : require("./../assets/images/blank-profile-picture.png")}
                            style={styles.image} 
                        />
                    </TouchableOpacity>
                    <View style={[base.alignItemsCenter, base.gap_8]}>
                        <Text style={[styles.userName]}>{user?.name}</Text>
                        <Text style={[styles.userEmail]}>{user?.email}</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.bottomMenu]}>
                <View style={[styles.containerMenu]}>
                    <View style={[base.flexRow, base.gap_18, base.alignItemsCenter]}>
                        <View style={[styles.containerIcon]}>
                            <FontAwesome6 name="building-columns" size={23} color={colors.gray_100}/>
                        </View>
                        <Text style={[styles.menuText]}>Contas</Text>
                    </View>
                    <FontAwesome6 name="angle-right" size={20} color={colors.gray_100}/>
                </View>
                <View style={[styles.line]} />
                <View style={[styles.containerMenu]}>
                    <View style={[base.flexRow, base.gap_18, base.alignItemsCenter]}>
                        <View style={[styles.containerIcon]}>
                            <FontAwesome6 name="credit-card" size={23} color={colors.gray_100}/>
                        </View>
                        <Text style={[styles.menuText]}>Cartões</Text>
                    </View>
                    <FontAwesome6 name="angle-right" size={20} color={colors.gray_100}/>
                </View>
                <View style={[styles.line]} />
                <View style={[styles.containerMenu]}>
                    <View style={[base.flexRow, base.gap_18, base.alignItemsCenter]}>
                        <View style={[styles.containerIcon]}>
                            <FontAwesome6 name="shapes" size={23} color={colors.gray_100}/>
                        </View>
                        <Text style={[styles.menuText]}>Categorias</Text>
                    </View>
                    <FontAwesome6 name="angle-right" size={20} color={colors.gray_100}/>
                </View>
                <View style={[styles.line]} />
                <View style={[styles.containerMenu]}>
                    <View style={[base.flexRow, base.gap_18, base.alignItemsCenter]}>
                        <View style={[styles.containerIcon]}>
                            <FontAwesome6 name="bullseye" size={23} color={colors.gray_100}/>
                        </View>
                        <Text style={[styles.menuText]}>Metas</Text>
                    </View>
                    <FontAwesome6 name="angle-right" size={20} color={colors.gray_100}/>
                </View>
                <View style={[styles.line]} />
                <View style={[styles.containerMenu]}>
                    <TouchableOpacity onPress={signOutUser}>
                        <View style={[base.flexRow, base.gap_18, base.alignItemsCenter]}>
                            <View style={[styles.containerIcon]}>
                                <FontAwesome6 name="arrow-right-from-bracket" size={23} color={colors.gray_100}/>
                            </View>
                            <Text style={[styles.menuText]}>Encerrar sessão</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 30
    },
    containerBack: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        marginTop: 30,
        marginBottom: 25,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 100,
    },
    userName: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 24,
        color: colors.gray_50,
        lineHeight: 24,
    },
    userEmail: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 18,
        color: colors.gray_200,
        lineHeight: 18,
    },
    balance: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 20,
        color: colors.gray_100
    },
    entrance: {
        color: colors.green_500,
    },
    exits: {
        color: colors.red_500,
    },
    remainder: {
        color: colors.blue_300,
    },
    valueBalance: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 18,
    },
    bottomMenu: {
        backgroundColor: colors.gray_800,
        //height: '63%',
        flex: 1,
        width: '100%',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        padding: 30,
        gap: 15
    },
    containerMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    containerIcon: {
        backgroundColor: colors.gray_750,
        padding: 8,
        borderRadius: 6,
        width: 42,
        alignItems: 'center'
    },
    menuText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        color: colors.gray_100
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray_600,
    },
});

export default Profile;
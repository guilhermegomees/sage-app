import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, updateProfile } from 'firebase/auth';
import { CommonActions, RouteProp, useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { app, db } from '~/config/firebase';
import colors from '~/css/colors';
import base from '~/css/base';
import { FontAwesome6 } from "@expo/vector-icons";
import { StackNavigationProp } from '@react-navigation/stack';

type ProfileScreenNavigationProp = StackNavigationProp<any, 'Profile'>;

type ProfileScreenRouteProp = RouteProp<StackParamList, 'Profile'>;

type StackParamList = {
    Profile: { fromScreen?: string };
};

const EditProfile = () => {
    const navigation = useNavigation();
    const auth = getAuth();
    const user = auth.currentUser;
    const storage = getStorage(app);

    const route = useRoute<ProfileScreenRouteProp>();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const { fromScreen } = route.params || {};

    const handleNavigateToBack = () => {
        navigation.goBack();
    }

    // Função para carregar os dados do usuário
    const loadUserData = async () => {
        if (user) {
            const userDocRef = doc(db, 'user', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                setName(userDoc.data()?.name || '');
                setEmail(userDoc.data()?.email || '');
                // Carregar a imagem de perfil a partir do Firebase Storage ou do Firebase Auth
                const photoURL = userDoc.data()?.photoURL || user.photoURL;
                if (photoURL) {
                    setProfileImage(photoURL);
                }
            }
        }
    };

    // Usando useFocusEffect para garantir que os dados sejam recarregados sempre que a tela for focada
    useFocusEffect(
        React.useCallback(() => {
            loadUserData();
        }, [user]) // Carregar dados sempre que o usuário mudar
    );

    const handleSave = async () => {
        if (user) {
            try {
                const userDocRef = doc(db, 'user', user.uid);
                
                await setDoc(userDocRef, { name, email }, { merge: true });

                navigation.replace('Profile') // Volta para a tela de perfil
            } catch (error) {
                console.error("Erro ao salvar perfil:", error);
            }
        }
    };

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
                const userDocRef = doc(db, 'user', user?.uid || '');
                await setDoc(userDocRef, { photoURL: imageUrl }, { merge: true });
    
                setProfileImage(imageUrl);
            } catch (error) {
                console.error("Erro ao fazer upload da imagem:", error);
            }
        }
    };

    return (
        <View style={[styles.container, base.gap_30]}>
            <View style={[styles.backContainer]}>
                <TouchableOpacity onPress={handleNavigateToBack} style={[styles.iconBack]}>
                    <FontAwesome6 name="angle-left" size={20} color={colors.gray_50} />
                </TouchableOpacity>
                <Text style={[styles.screenTitle]}>Editar Perfil</Text>
            </View>
           
            <View style={[base.alignItemsCenter, base.gap_20, { marginTop: fromScreen === 'Home' ? 0 : 30 }]}>
                <TouchableOpacity onPress={handleImagePick}>
                    <Image 
                        source={profileImage 
                            ? { uri: profileImage } 
                            : require("./../assets/images/blank-profile-picture.png")}
                        style={styles.image} 
                    />
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Nome</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Digite seu nome"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu email"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.gray_900,
    },
    label: {
        fontSize: 16,
        color: colors.gray_100,
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: colors.gray_800,
        color: colors.gray_50,
    },
    saveButton: {
        width: '100%',
        backgroundColor: colors.blue_600,
        borderRadius: 15,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    saveButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    backContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        marginBottom: 25,
        gap: 10
    },
    iconBack: {
        justifyContent: "center",
        width: 30,
        height: 30
    },
    screenTitle: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.gray_50,
        fontSize: 22,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 100,
    },
});

export default EditProfile;
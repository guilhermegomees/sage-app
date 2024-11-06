import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadString, uploadBytes } from 'firebase/storage';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { app, db } from '~/config/firebase';
import colors from '~/css/colors';
import base from '~/css/base';
import { FontAwesome6 } from "@expo/vector-icons";
import { StackNavigationProp } from '@react-navigation/stack';
import Input from '~/components/Input';
import OptionsModal from '~/components/OptionsModal';
import { useProfile } from '~/context/ProfileContext';
import useUser from '~/hooks/useUser';

const EditProfile = () => {
    const navigation = useNavigation<StackNavigationProp<any, 'EditProfile'>>();
    const user = useUser();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isOptionsModalVisible, setIsOptionsModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const { profileInfo, profilePicture, setProfilePicture, fetchProfileInfo } = useProfile();

    const handleNavigateToBack = () => {
        navigation.goBack();
    }

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                await fetchProfileInfo(user);
                setName(profileInfo[0].name);
                setEmail(profileInfo[0].email);
                setProfilePicture(profilePicture);
            }
        };
    
        fetchData();
    }, [user]);

    const handleSave = async () => {
        if (user) {
            try {
                const userDocRef = doc(db, 'user', user.uid);
                
                await setDoc(userDocRef, { name, email }, { merge: true });

                navigation.replace('Profile')
            } catch (error) {
                console.error("Erro ao salvar perfil:", error);
            }
        }
    };

    // Função para abrir a galeria ou a câmera
    const pickImage = async (fromCamera: boolean) => {
        let result;
        if (fromCamera) {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.1,
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.3,
            });
        }

        if (!result.canceled && result.assets[0]) {
            setProfilePicture(result.assets[0].uri);
            return result.assets[0].uri;
        } else {
            alert('Nenhuma imagem selecionada.');
            return null;
        }
    };

    // Função para fazer o upload da imagem para o Firebase Storage
    const uploadImageToFirebase = async (uri: string) => {
        const storage = getStorage();
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `profile_pictures/${user?.uid}.jpg`);
        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);
        return downloadUrl;
    };

    // Função para salvar a URL da imagem no Firestore
    const saveProfileImageToFirestore = async (downloadUrl: string) => {
        const db = getFirestore();
        if(user){
            const userDocRef = doc(db, 'user', user.uid);
            await updateDoc(userDocRef, { photoURL: downloadUrl });
        }
    };

    // Função para o fluxo completo
    const handleProfileImageUpload = async (fromCamera: boolean) => {
        setLoading(true);

        const uri = await pickImage(fromCamera);
        if (uri) {
            try {
                const downloadUrl = await uploadImageToFirebase(uri);
                await saveProfileImageToFirestore(downloadUrl);
                if(user) {
                    await fetchProfileInfo(user);
                }
            } catch (error) {
                console.error(error);
                alert('Ocorreu um erro ao atualizar a imagem de perfil.');
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    return (
        <>
            <View style={[styles.container, base.gap_20]}>
                <View style={[styles.containerBack]}>
                    <TouchableOpacity onPress={handleNavigateToBack} style={[styles.iconBack]}>
                        <FontAwesome6 name="angle-left" size={20} color={colors.gray_50} />
                    </TouchableOpacity>
                    <Text style={[styles.screenTitle]}>Editar Perfil</Text>
                </View>
                <View style={[base.alignItemsCenter, base.gap_20, base.mt_5]}>
                    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                        <Image 
                            source={(profileInfo.length > 0 && profileInfo[0].photoURL) || profilePicture 
                                ? { uri: profileInfo[0].photoURL || profilePicture }
                                : require("./../assets/images/blank-profile-picture.png")}
                            style={styles.image} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.editPhoto]} onPress={() => { setIsOptionsModalVisible(true) }}>
                        <FontAwesome6 name="pencil" size={15} color={colors.white} />
                    </TouchableOpacity>
                </View>
                <Modal
                    isVisible={isModalVisible}
                    onBackdropPress={() => setIsModalVisible(false)}
                    onBackButtonPress={() => setIsModalVisible(false)}
                    useNativeDriver
                    style={styles.modal}
                >
                    <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalClose}>
                        <FontAwesome6 name="x" size={14} color={colors.white} />
                    </TouchableOpacity>
                    <Image
                        source={profilePicture 
                            ? { uri: profilePicture } 
                            : require("./../assets/images/blank-profile-picture.png")}
                        style={styles.imageFullScreen}
                        resizeMode="contain"
                    />
                </Modal>
                <OptionsModal
                    isVisible={isOptionsModalVisible}
                    onClose={() => setIsOptionsModalVisible(false)}
                    modalName='Foto de perfil'
                    options={[
                        { label: 'Câmera', icon: 'camera', color: colors.gray_100, onPress: () => { handleProfileImageUpload(true) } },
                        { label: 'Galeria', icon: 'image', color: colors.gray_100, onPress: () => { handleProfileImageUpload(false) } },
                    ]}
                />
                <View style={[base.gap_10]}>
                    <Text style={[base.inputText]}>Nome</Text>
                    <Input
                        styleInput={[base.input, {backgroundColor: colors.gray_800}]}
                        value={name}
                        onChangeText={setName}
                        placeholder="Digite seu nome"
                    />
                </View>
                <View style={[base.gap_10]}>
                    <Text style={[base.inputText]}>Email</Text>
                    <Input
                        styleInput={[base.input, {backgroundColor: colors.gray_800}]}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Digite seu email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
            </View>
            {loading && (
                <View style={[base.flex_1, base.w_100, base.h_100, base.flexAlignCenter, base.justifyContentCenter, {position: 'absolute'}]}>
                    <View style={[base.flex_1, base.w_100, base.h_100, base.flexAlignCenter, base.justifyContentCenter, {backgroundColor: colors.gray_900, opacity: 0.5, position: 'absolute'}]}/>
                    <View style={[base.flexRow, base.gap_10, base.alignItemsCenter, base.justifyContentCenter]}>
                        <Text style={{fontFamily: 'Outfit_500Medium', fontSize: 20, color: colors.white}}>Alterando foto de perfil</Text>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.gray_900,
    },
    editPhoto: {
        backgroundColor: colors.blue_600,
        padding: 10,
        borderRadius: 50,
        position: 'absolute',
        bottom: 0,
        right: 140
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
    containerBack: {
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
        width: 100,
        height: 100,
        borderRadius: 100,
    },
    modal: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 390,
        height: 520,
        backgroundColor: colors.gray_800,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageFullScreen: {
        width: '90%',
        height: '80%',
        borderRadius: 20,
    },
    modalClose: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 1,
        padding: 10,
        backgroundColor: colors.gray_900,
        borderRadius: 50
    },
    closeText: {
        color: colors.white,
        fontSize: 16,
    },
});

export default EditProfile;
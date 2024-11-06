import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { CommonActions, useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import useUser from '~/hooks/useUser';
import colors from '~/css/colors';
import { app, db } from '~/config/firebase';
import { FontAwesome6 } from '@expo/vector-icons';
import base from '~/css/base';
import { useProfile } from '~/context/ProfileContext';

const Profile: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<any, 'Profile'>>();
    const user = useUser();
    const auth = getAuth(app);

    const { profileInfo, profilePicture, fetchProfileInfo } = useProfile();

    useEffect(() => {
        if(user){
            fetchProfileInfo(user);
        }
    }, [user]);

    const signOutUser = async () => {
        try {
            await signOut(auth);
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                })
            );
        } catch (error) {
            console.log("Erro ao deslogar:", error);
        }
    };

    return (
        <View style={[base.flex_1, base.gap_50, { backgroundColor: colors.gray_900 }]}>
            <View style={styles.container}>
                <View style={[base.alignItemsCenter, base.gap_20, base.mt_30]}>
                    <Image
                        source={(profileInfo.length > 0 && profileInfo[0].photoURL) || profilePicture 
                            ? { uri: profileInfo[0].photoURL || profilePicture }
                            : require("./../assets/images/blank-profile-picture.png")}
                        style={styles.image}
                    />
                    <View style={[base.alignItemsCenter, base.gap_8]}>
                        <Text style={styles.userName}>{profileInfo.length > 0 && profileInfo[0].name}</Text>
                        <Text style={styles.userEmail}>{profileInfo.length > 0 && profileInfo[0].email}</Text>
                        <TouchableOpacity style={styles.editButton} onPress={() => { navigation.navigate('EditProfile'); }}>
                            <Text style={styles.editButtonText}>Editar perfil</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.bottomMenu}>
                <TouchableOpacity onPress={() => { navigation.navigate('Accounts'); }}>
                    <View style={styles.containerMenu}>
                        <View style={[base.flexRow, base.gap_18, base.alignItemsCenter]}>
                            <View style={styles.containerIcon}>
                                <FontAwesome6 name="building-columns" size={23} color={colors.gray_100} />
                            </View>
                            <Text style={styles.menuText}>Contas</Text>
                        </View>
                        <FontAwesome6 name="angle-right" size={20} color={colors.gray_100} />
                    </View>
                </TouchableOpacity>
                <View style={styles.line} />
                <TouchableOpacity onPress={() => { navigation.navigate('CreditCards'); }}>
                    <View style={styles.containerMenu}>
                        <View style={[base.flexRow, base.gap_18, base.alignItemsCenter]}>
                            <View style={styles.containerIcon}>
                                <FontAwesome6 name="credit-card" size={23} color={colors.gray_100} />
                            </View>
                            <Text style={styles.menuText}>Cartões</Text>
                        </View>
                        <FontAwesome6 name="angle-right" size={20} color={colors.gray_100} />
                    </View>
                </TouchableOpacity>
                <View style={styles.line} />
                <TouchableOpacity onPress={() => { navigation.navigate('Categories'); }}>
                    <View style={styles.containerMenu}>
                        <View style={[base.flexRow, base.gap_18, base.alignItemsCenter]}>
                            <View style={styles.containerIcon}>
                                <FontAwesome6 name="shapes" size={23} color={colors.gray_100} />
                            </View>
                            <Text style={styles.menuText}>Categorias</Text>
                        </View>
                        <FontAwesome6 name="angle-right" size={20} color={colors.gray_100} />
                    </View>
                </TouchableOpacity>
                <View style={styles.line} />
                <TouchableOpacity onPress={() => { navigation.navigate('Goals'); }}>
                    <View style={styles.containerMenu}>
                        <View style={[base.flexRow, base.gap_18, base.alignItemsCenter]}>
                            <View style={styles.containerIcon}>
                                <FontAwesome6 name="bullseye" size={23} color={colors.gray_100} />
                            </View>
                            <Text style={styles.menuText}>Metas</Text>
                        </View>
                        <FontAwesome6 name="angle-right" size={20} color={colors.gray_100} />
                    </View>
                </TouchableOpacity>
                <View style={styles.line} />
                <View style={styles.containerMenu}>
                    <TouchableOpacity onPress={signOutUser}>
                        <View style={[base.flexRow, base.gap_18, base.alignItemsCenter]}>
                            <View style={styles.containerIcon}>
                                <FontAwesome6 name="arrow-right-from-bracket" size={23} color={colors.gray_100} />
                            </View>
                            <Text style={styles.menuText}>Encerrar sessão</Text>
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
    bottomMenu: {
        backgroundColor: colors.gray_800,
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
        color: colors.gray_100,
        height: 16
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray_600,
    },
    editButtonText: {
        color: colors.gray_50,
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        lineHeight: 16,
    },
    editButton: {
        backgroundColor: colors.gray_600,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    }
});

export default Profile;
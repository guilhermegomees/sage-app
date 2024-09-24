import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Input from '~/components/Input';
import Overlay from '~/components/Overlay';
import PasswordInput from '~/components/PasswordInput';
import base from '~/css/base';
import colors from '~/css/colors';

const { width, height } = Dimensions.get('window');

type RegisterScreenNavigationProp = StackNavigationProp<any, 'Register'>;

const RegisterScreen = () => {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [overlay, setOverley] = useState(false);

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    const handleRegister = () => {
        navigation.navigate('Main');
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={[base.flex_1]}>
                <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                <Text style={styles.nameCompany}>Sage</Text>
                <View style={styles.halfContainer}>
                    <Text style={styles.title}>Seja bem-vindo(a)</Text>
                    <View style={styles.inputsContainer}>
                        <Input
                            style={[base.input]}
                            inputWrapperColor={colors.gray_800}
                            placeholder="Nome"
                            placeholderTextColor={colors.gray_200}
                            onChangeText={(name: string) => setName(name)}
                            value={name}
                            icon="person"
                            overlay={(value: boolean) => setOverley(value)}
                        />
                        <Input
                            style={[base.input]}
                            inputWrapperColor={colors.gray_800}
                            placeholder="E-mail"
                            placeholderTextColor={colors.gray_200}
                            onChangeText={(name: string) => setEmail(name)}
                            value={email}
                            icon="email"
                            overlay={(value: boolean) => setOverley(value)}
                        />
                        <PasswordInput
                            style={[base.input]}
                            inputWrapperColor={colors.gray_800}
                            placeholder="Senha"
                            placeholderTextColor={colors.gray_200}
                            onChangeText={(name: string) => setPassword(name)}
                            value={password}
                            overlay={(value: boolean) => setOverley(value)}
                        />
                        <PasswordInput
                            style={[base.input]}
                            inputWrapperColor={colors.gray_800}
                            placeholder="Confirmar senha"
                            placeholderTextColor={colors.gray_200}
                            onChangeText={(name: string) => setConfirmPassword(name)}
                            value={confirmPassword}
                            overlay={(value: boolean) => setOverley(value)}
                        />
                    </View>
                    <TouchableOpacity style={styles.loginBtn} onPress={handleRegister}>
                        <Text style={styles.loginBtnText}>Criar conta</Text>
                    </TouchableOpacity>
                    <View style={[base.flexRow, base.gap_4, base.mb_10]}>
                        <Text style={styles.signUpText}>Já possui uma conta?</Text>
                        <TouchableOpacity onPress={handleLogin}>
                            <Text style={styles.signUpTextLink}>Clique aqui</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {overlay && <Overlay style={[styles.overlay]} />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.gray_900,
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 20,
        marginTop: 15,
        marginBottom: 25,
        alignSelf: 'flex-end',
    },
    nameCompany: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 45,
        height: 60,
        color: colors.gray_50,
        textAlign: 'center',
        marginBottom: 50
    },
    halfContainer: {
        flex: 1,
        alignItems: 'center',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: colors.gray_800,
        paddingHorizontal: 30,
    },
    title: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 25,
        color: colors.gray_50,
        marginTop: 40,
        marginBottom: 40,
        height: 33
    },
    inputsContainer: {
        gap: 25,
        marginBottom: 35
    },
    input: {
        width: '100%',
        backgroundColor: colors.gray_900,
        borderRadius: 15,
        height: 50,
        alignItems: 'center',
        paddingHorizontal: 15
    },
    inputText: {
        fontFamily: 'Outfit_500Medium',
        height: 50,
        color: colors.white,
        flex: 1
    },
    loginBtn: {
        width: '100%',
        backgroundColor: colors.blue_600,
        borderRadius: 15,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    loginBtnText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 20,
        color: colors.gray_50,
    },
    signUpText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 15,
        color: colors.gray_50,
    },
    signUpTextLink: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 15,
        color: colors.blue_300,
        textDecorationLine: 'underline'
    },
    overlay: {
        width,
        height
    },
});

export default RegisterScreen;

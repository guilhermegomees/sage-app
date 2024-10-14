import React, { useState } from 'react';
import { ScrollView, View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Input from '~/components/Input';
import PasswordInput from '~/components/PasswordInput';
import base from '~/css/base';
import colors from '~/css/colors';
import { FIREBASE_AUTH } from '~/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

type LoginScreenNavigationProp = StackNavigationProp<any, 'Login'>;

const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const auth = FIREBASE_AUTH;

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    const signIn = async () => {
        try{
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            navigation.navigate('Main');
        } catch (error: any){
            console.log(error);
            if(error.message = 'auth/missing-password'){
                setErrorMessage('Por favor insira sua senha.');
            }if(error.message = 'auth/invalid-email'){
                setErrorMessage('E-mail inválido.');
            }if(error.message = 'auth/invalid-credential'){
                setErrorMessage('E-mail ou Senha incorretos.')
            }
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={[base.flex_1]}>
                <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                <Text style={styles.nameCompany}>Sage</Text>
                <View style={styles.halfContainer}>
                    <Text style={styles.title}>Bem-vindo(a) de volta</Text>
                    <View style={styles.inputsContainer}>
                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                        <Input
                            placeholder='E-mail'
                            value={email}
                            onChangeText={setEmail}
                            icon='envelope'
                            keyboardType='email-address'
                        />
                        <PasswordInput
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    <TouchableOpacity style={styles.loginBtn} onPress={signIn}>
                        <Text style={styles.loginBtnText}>Entrar</Text>
                    </TouchableOpacity>
                    <View style={[base.flexRow, base.gap_4, base.mb_10]}>
                        <Text style={styles.signUpText}>Sem Conta?</Text>
                        <TouchableOpacity onPress={handleRegister}>
                            <Text style={styles.signUpTextLink}>Registre Aqui</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
        marginBottom: 40,
        alignSelf: 'flex-end',
    },
    nameCompany: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 45,
        height: 60,
        color: colors.gray_50,
        textAlign: 'center',
        marginBottom: 90
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
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
        marginBottom: 50,
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
        fontSize: 16,
        color: colors.gray_50,
    },
    signUpTextLink: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        color: colors.blue_300,
        textDecorationLine: 'underline'
    },
});

export default LoginScreen;

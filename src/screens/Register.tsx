import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, TextInput, TouchableOpacity, View, StyleSheet, Image, Text, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import base from '~/css/base';
import colors from '~/css/colors';
import Overlay from '~/components/Overlay';
import { FIREBASE_AUTH } from '~/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

type RegisterScreenNavigationProp = StackNavigationProp<any, 'Register'>;

const RegisterScreen = () => {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const [name, setName] = useState(''); // Adicionado estado para o nome
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Controlar a visibilidade da senha
    const [errorMessage, setErrorMessage] = useState(''); // Mensagem de erro caso o cadastro falhe
    const [overlay, setOverley] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        if (password !== confirmPassword) {
            setErrorMessage('As senhas não correspondem.');
            return;
        }
        try{
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            navigation.navigate('Main');
        } catch (error: any){
            console.log(error);
            setErrorMessage('Sign in failed: ' + error.message);
        }
    }
    const handleLogin = () => {
        navigation.navigate('Login');
    };

    // const handleRegister = async () => {
    //     if (password !== confirmPassword) {
    //         setErrorMessage('As senhas não correspondem.');
    //         return;
    //     }
    // };

    // Alternar entre mostrar e ocultar a senha
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={[base.flex_1]}>
                <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                <Text style={styles.nameCompany}>Sage</Text>
                <View style={styles.halfContainer}>
                    <Text style={styles.title}>Seja bem-vindo(a)</Text>
                    <View style={styles.inputsContainer}>
                        <View style={[styles.input, base.flexRowReverse]}>
                            <MaterialIcons name="person" size={20} color={colors.gray_200} />
                            <TextInput
                                style={styles.inputText}
                                placeholder="Nome"
                                placeholderTextColor={colors.gray_200}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                        <View style={[styles.input, base.flexRowReverse]}>
                            <MaterialIcons name="email" size={20} color={colors.gray_200} />
                            <TextInput
                                style={styles.inputText}
                                placeholder="E-mail"
                                placeholderTextColor={colors.gray_200}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                        </View>
                        <View style={[styles.input, base.flexRow]}>
                            <TextInput
                                style={styles.inputText}
                                placeholder="Senha"
                                placeholderTextColor={colors.gray_200}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={toggleShowPassword}>
                                <MaterialIcons
                                    name={showPassword ? 'visibility-off' : 'visibility'}
                                    size={20}
                                    color={colors.gray_200}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.input, base.flexRow]}>
                            <TextInput
                                style={styles.inputText}
                                placeholder="Confirmar senha"
                                placeholderTextColor={colors.gray_200}
                                secureTextEntry={!showPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity onPress={toggleShowPassword}>
                                <MaterialIcons
                                    name={showPassword ? 'visibility-off' : 'visibility'}
                                    size={20}
                                    color={colors.gray_200}
                                />
                            </TouchableOpacity>
                        </View>
                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                    </View>
                    <TouchableOpacity style={styles.loginBtn} onPress={signIn}>
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
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
    overlay: {
        width,
        height
    },
});

export default RegisterScreen;

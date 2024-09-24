import React, { useState } from 'react';
import { Dimensions, ScrollView, View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Input from '~/components/Input';
import Overlay from '~/components/Overlay';
import PasswordInput from '~/components/PasswordInput';
import base from '~/css/base';
import colors from '~/css/colors';

const { width, height } = Dimensions.get('window');

type LoginScreenNavigationProp = StackNavigationProp<any, 'Login'>;

const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [overlay, setOverley] = useState(false);

    const handleLogin = () => {
        navigation.navigate('Main');
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={[base.flex_1]}>
                <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                <Text style={styles.nameCompany}>Sage</Text>
                <View style={styles.halfContainer}>
                    <Text style={styles.title}>Bem-vindo(a) de volta</Text>
                    <View style={styles.inputsContainer}>
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
                    </View>
                    <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
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

export default LoginScreen;

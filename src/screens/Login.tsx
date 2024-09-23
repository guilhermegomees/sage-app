import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    StackNavigationProp,
    base,
    colors,
    MaterialIcons,
    useNavigation
} from '~/imports';

type LoginScreenNavigationProp = StackNavigationProp<any, 'Login'>;

const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [showPassword, setShowPassword] = useState(false); // Controlar a visibilidade da senha

    const handleLogin = () => {
        navigation.navigate('Home');
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

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
                    <Text style={styles.title}>Bem-vindo(a) de volta</Text>
                    <View style={styles.inputsContainer}>
                        <View style={[styles.input, base.flexRowReverse]}>
                            <MaterialIcons name="email" size={20} color={colors.gray_200} />
                            <TextInput style={styles.inputText} placeholder="E-mail" placeholderTextColor={colors.gray_200} />
                        </View>
                        <View style={[styles.input, base.flexRow]}>
                            <TextInput
                                style={styles.inputText}
                                placeholder="Senha"
                                placeholderTextColor={colors.gray_200}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={toggleShowPassword}>
                                <MaterialIcons
                                    name={showPassword ? 'visibility-off' : 'visibility'}
                                    size={20}
                                    color={colors.gray_200}
                                />
                            </TouchableOpacity>
                        </View>
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
        marginBottom: 50
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
});

export default LoginScreen;

import React, { useState } from 'react';
import { ScrollView, View, Image, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

type LoginScreenNavigationProp = StackNavigationProp<any, 'Login'>;

const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Função de login com Firebase
    const handleLogin = async () => {
        try {
            await auth().signInWithEmailAndPassword(email, password);
            navigation.navigate('Home'); // Navegar para Home após o login bem-sucedido
        } catch (error) {
            setErrorMessage('Falha no login. Verifique suas credenciais.');
        }
    };

    const handleRegister = async () => {
        try {
            await auth().createUserWithEmailAndPassword(email, password);
            navigation.navigate('Home'); // Navegar para Home após o registro bem-sucedido
        } catch (error) {
            setErrorMessage('Falha no registro. Verifique suas credenciais.');
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.flex_1}>
                <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                <Text style={styles.nameCompany}>Sage</Text>
                <View style={styles.halfContainer}>
                    <Text style={styles.title}>Bem-vindo(a) de volta</Text>
                    {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
                    <View style={styles.inputsContainer}>
                        <View style={[styles.input, styles.flexRowReverse]}>
                            <MaterialIcons name="email" size={20} color="#b0b0b0" />
                            <TextInput
                                style={styles.inputText}
                                placeholder="E-mail"
                                placeholderTextColor="#b0b0b0"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                        </View>
                        <View style={[styles.input, styles.flexRow]}>
                            <TextInput
                                style={styles.inputText}
                                placeholder="Senha"
                                placeholderTextColor="#b0b0b0"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={toggleShowPassword}>
                                <MaterialIcons
                                    name={showPassword ? 'visibility-off' : 'visibility'}
                                    size={20}
                                    color="#b0b0b0"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                        <Text style={styles.loginBtnText}>Entrar</Text>
                    </TouchableOpacity>
                    <View style={styles.flexRow}>
                        <Text style={styles.signUpText}>Sem Conta?</Text>
                        <TouchableOpacity onPress={handleRegister}>
                            <Text style={styles.signUpTextLink}>Registre Aqui2</Text>
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
        backgroundColor: '#121212',
    },
    flex_1: {
        flex: 1,
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
        fontSize: 45,
        height: 60,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 90,
    },
    halfContainer: {
        flex: 1,
        alignItems: 'center',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: '#1E1E1E',
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 25,
        color: '#fff',
        marginTop: 40,
        marginBottom: 40,
        height: 33,
    },
    inputsContainer: {
        gap: 25,
        marginBottom: 50,
    },
    input: {
        width: '100%',
        backgroundColor: '#121212',
        borderRadius: 15,
        height: 50,
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    inputText: {
        height: 50,
        color: '#fff',
        flex: 1,
    },
    loginBtn: {
        width: '100%',
        backgroundColor: '#1E88E5',
        borderRadius: 15,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    loginBtnText: {
        fontSize: 20,
        color: '#fff',
    },
    signUpText: {
        fontSize: 15,
        color: '#fff',
    },
    signUpTextLink: {
        fontSize: 15,
        color: '#1E88E5',
        textDecorationLine: 'underline',
    },
    errorMessage: {
        color: '#ff3333',
        marginBottom: 10,
    },
    flexRow: {
        flexDirection: 'row',
        gap: 4,
    },
    flexRowReverse: {
        flexDirection: 'row-reverse',
    },
});

export default LoginScreen;

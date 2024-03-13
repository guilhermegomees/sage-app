import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  Keyboard,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { colors } from '../css/colors';
import { base } from '../css/base';

import TabNavigator from '../navigation/tabNavigator';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha

  const handleLogin = () => {
    // Lógica de login
    // Navegar para a tela TabNavigator
    //navigation.navigate('TabNavigator')
  };

  const handleRegister = () => {
    // Lógica de registro
  };

  const handleGoogleLogin = () => {
    // Lógica de login com o Google
  };

  const toggleShowPassword = () => {
    // Função para alternar entre mostrar e ocultar a senha
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View>
        <Image source={require('../image/logo.png')} style={styles.imageLogo} />
        <Text style={styles.logo}>SAGE</Text>
        <View style={styles.halfContainer}>
          <Text style={styles.subLogo}>Bem vindo(a) de volta</Text>
          <View style={[styles.inputView, { flexDirection: 'row-reverse' }]}>
            <MaterialIcons name="email" size={20} color="white" style={styles.icon} />
            <TextInput style={styles.inputText} placeholder="E-mail" placeholderTextColor="#F8F1F1" />
          </View>
          <View style={[styles.inputView, { flexDirection: 'row' }]}>
            <TextInput
              style={styles.inputText}
              placeholder="Senha"
              placeholderTextColor="#F8F1F1"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={toggleShowPassword}>
              <MaterialIcons
                name={showPassword ? 'visibility-off' : 'visibility'}
                size={20}
                color="white"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.signupText}>Sem Conta? Registrar Aqui</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginGoogleBtn} onPress={handleGoogleLogin}>
            <Image source={require('../image/google.png')} style={styles.image} />
            <Text style={styles.googleText}>Continue com Google</Text>
          </TouchableOpacity>
          <ImageBackground
            source={require('../image/backgroundLogin.png')}
            style={styles.backgroundImage}
          />
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
    fontWeight: 'bold',
    fontSize: 50,
    color: colors.white_100,
    marginBottom: 40,
    textAlign: 'center',
    marginTop: 90
  },
  subLogo: {
    fontWeight: 'bold',
    fontSize: 25,
    color: colors.white_100,
    marginTop: -100,
  },
  inputView: {
    width: '80%',
    backgroundColor: colors.gray_900,
    borderRadius: 15,
    height: 50,
    marginBottom: 20,
    flexDirection: 'row', // Alterado para flex direction row
    alignItems: 'center', // Alinha os itens verticalmente
    marginTop: 10,
  },
  inputText: {
    height: 50,
    color: colors.white,
    flex: 1, // Ocupa o restante do espaço disponível
    marginLeft: 10, // Adiciona um espaçamento entre o ícone e o texto
  },
  loginBtn: {
    width: '80%',
    backgroundColor: colors.blue_100,
    borderRadius: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  loginGoogleBtn: {
    width: '55%',
    backgroundColor: colors.white,
    borderRadius: 25,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  loginText: {
    color: colors.white,
  },
  signupText: {
    color: colors.white,
  },
  googleText: {},
  image: {
    width: 30,
    height: 30,
  },
  halfContainer: {
    width: '100%',
    height: '69%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: colors.gray_800,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '75%',
    bottom: -80,
    zIndex: -1,
  },
  icon: {
    marginRight: 10,
  },
  imageLogo: {
    marginTop: 50,
    width: 45,
    height: 45,
    marginRight: 20,
    alignSelf: 'flex-end',
  },
});

export default LoginScreen;
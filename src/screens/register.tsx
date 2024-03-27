import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Importe o pacote de ícones que você deseja usar

import { useNavigation } from '@react-navigation/native';

import { colors } from '../css/colors';
import { base } from '../css/base';

import TabNavigator from '../navigation/tabs';

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha
  const [keyboardIsShown, setKeyboardIsShown] = useState(false);

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

  const handleKeyboardDidShow = () => {
    setKeyboardIsShown(true);
  };

  const handleKeyboardDidHide = () => {
    setKeyboardIsShown(false);
  };

  const toggleShowPassword = () => {
    // Função para alternar entre mostrar e ocultar a senha
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!keyboardIsShown}>
        <Image source={require('../assets/images/logo.png')} style={styles.imageLogo} />
        <Text style={styles.logo}>SAGE</Text>
        <View style={styles.halfContainer}>
          <Text style={styles.subLogo}>Bem vindo(a)</Text>
          <View style={[styles.inputView, { flexDirection: 'row-reverse' }]}>
            <MaterialIcons name="person" size={20} color="white" style={styles.icon} />
            <TextInput style={styles.inputText} placeholder="Nome" placeholderTextColor="#F8F1F1" />
          </View>
          <View style={[styles.inputView, { flexDirection: 'row-reverse' }]}>
            <MaterialIcons name="email" size={20} color="white" style={styles.icon} />
            <TextInput
              style={styles.inputText}
              placeholder="E-mail"
              placeholderTextColor="#F8F1F1"
            />
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
          <View style={[styles.inputView, { flexDirection: 'row' }]}>
            <TextInput
              style={styles.inputText}
              placeholder="Confirmar Senha"
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

          <TouchableOpacity style={styles.loginBtn} onPress={handleRegister}>
            <Text style={styles.loginText}>Criar Conta</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.signupText}>Já possui conta? Clique Aqui</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginGoogleBtn} onPress={handleGoogleLogin}>
            <Image source={require('../assets/images/google.png')} style={styles.image} />
            <Text style={styles.googleText}>Continue com Google</Text>
          </TouchableOpacity>
          <ImageBackground
            source={require('../assets/images/backgroundLogin.png')}
            style={styles.backgroundImage}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray_900,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 40,
    color: colors.white_100,
    marginBottom: 40,
  },
  subLogo: {
    fontWeight: 'bold',
    fontSize: 30,
    color: colors.white_100,
    marginTop: 0,
  },
  inputView: {
    width: '80%',
    backgroundColor: colors.gray_900,
    borderRadius: 15,
    height: 50,
    marginBottom: 20,
    flexDirection: 'row', // Alterado para flex direction row
    alignItems: 'center', // Alinha os itens verticalmente
    marginTop: 15,
  },
  inputText: {
    height: 50,
    color: colors.white,
    flex: 1, // Ocupa o restante do espaço disponível
    marginLeft: 10, // Adiciona um espaçamento entre o ícone e o texto
  },
  icon: {
    marginRight: 10,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: colors.blue_100,
    borderRadius: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
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
    marginTop: 20,
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
  imageLogo: {
    marginTop: 100,
    width: 45,
    height: 45,
    marginRight: 20,
    alignSelf: 'flex-end',
  },
  halfContainer: {
    width: '100%',
    height: '85%', // Alterado para ocupar 100% do espaço disponível
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: colors.gray_800,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '59%',
    bottom: -140,
    zIndex: -1,
  },
});

export default RegisterScreen;

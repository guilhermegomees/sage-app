import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Importe o pacote de ícones que você deseja usar

import { useNavigation } from '@react-navigation/native';

import { colors } from '../css/colors';
import { base } from '../css/base';

import TabNavigator from '../navigation/tabNavigator';

const RegisterScreen = () => {
  const navigation = useNavigation();

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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!keyboardIsShown}
      >
        <Text style={styles.logo}>SAGE</Text>
        <View style={styles.halfContainer}>
          <Text style={styles.subLogo}>Bem vindo(a) de volta</Text>
          <View style={styles.inputView}>
            <MaterialIcons name="person" size={20} color="white" style={styles.icon} />
            <TextInput
              style={styles.inputText}
              placeholder="Nome"
              placeholderTextColor="#F8F1F1"
            />
          </View>
          <View style={styles.inputView}>
            <MaterialIcons name="email" size={20} color="white" style={styles.icon} />
            <TextInput
              style={styles.inputText}
              placeholder="E-mail"
              placeholderTextColor="#F8F1F1"
            />
          </View>
          <View style={styles.inputView}>
            <MaterialIcons name="lock" size={20} color="white" style={styles.icon} />
            <TextInput
              style={styles.inputText}
              placeholder="Senha"
              placeholderTextColor="#F8F1F1"
              secureTextEntry={true}
            />
          </View>
          <View style={styles.inputView}>
            <MaterialIcons name="lock" size={20} color="white" style={styles.icon} />
            <TextInput
              style={styles.inputText}
              placeholder="Confirmar Senha"
              placeholderTextColor="#F8F1F1"
              secureTextEntry={true}
            />
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={handleRegister}>
            <Text style={styles.loginText}>Criar Conta</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.signupText}>Já possui conta? Clique Aqui</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginGoogleBtn} onPress={handleGoogleLogin}>
            <Image
              source={require('../image/google.png')}
              style={styles.image}
            />
            <Text style={styles.googleText}>Continue com Google</Text>
          </TouchableOpacity>
          <ImageBackground
            source={require('../image/backgroundLogin.png')}
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
    marginTop: 100,
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
    marginLeft: 10, // Adiciona um espaçamento entre o ícone e a borda do input
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
  googleText: {
  },
  image: {
    width: 30,
    height: 30,
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

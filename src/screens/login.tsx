import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { colors } from '../css/colors';
import { base } from '../css/base';

const LoginScreen = () => {
  const handleLogin = () => {
    // Lógica de login
  };

  const handleRegister = () => {
    // Lógica de registro
  };

  const handleGoogleLogin = () => {
    // Lógica de login com o Google
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SAGE</Text>
      <View style={styles.halfContainer}>
        <Text style={styles.subLogo}>Bem vindo(a) de volta</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="E-mail"
            placeholderTextColor="#F8F1F1"
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Senha"
            placeholderTextColor="#F8F1F1"
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.signupText}>Sem Conta? Registrar Aqui</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray_900,
    fontFamily: 'Outfit', // Nome da fonte personalizada
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: colors.white_100,
    marginBottom: 40,
    marginTop: 200,
    fontFamily: 'Outfit', // Nome da fonte personalizada
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
    justifyContent: 'center',
    padding: 20,
    marginTop: 25,
  },
  inputText: {
    height: 50,
    color: colors.white,
    fontFamily: 'Outfit', // Nome da fonte personalizada
  },
  loginBtn: {
    width: '80%',
    backgroundColor: colors.blue_100,
    borderRadius: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
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
    marginTop: 100,
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
    width: 40,
    height: 40,
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
    bottom: 0,
  },
});

export default LoginScreen;

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

type RegisterScreenNavigationProp = StackNavigationProp<any, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [showPassword, setShowPassword] = useState(false); // Controlar a visibilidade da senha

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Home');
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
          <Text style={styles.title}>Seja bem-vindo(a)</Text>
          <View style={styles.inputsContainer}>
            <View style={[styles.input, base.flexRowReverse]}>
              <MaterialIcons name="person" size={20} color={colors.white_250} />
              <TextInput style={styles.inputText} placeholder="Nome" placeholderTextColor={colors.white_250} />
            </View>
            <View style={[styles.input, base.flexRowReverse]}>
              <MaterialIcons name="email" size={20} color={colors.white_250} />
              <TextInput style={styles.inputText} placeholder="E-mail" placeholderTextColor={colors.white_250} />
            </View>
            <View style={[styles.input, base.flexRow]}>
              <TextInput
                style={styles.inputText}
                placeholder="Senha"
                placeholderTextColor={colors.white_250}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={toggleShowPassword}>
                <MaterialIcons
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color={colors.white_250}
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.input, base.flexRow]}>
              <TextInput
                style={styles.inputText}
                placeholder="Confirmar senha"
                placeholderTextColor={colors.white_250}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={toggleShowPassword}>
                <MaterialIcons
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color={colors.white_250}
                />
              </TouchableOpacity>
            </View>
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
    color: colors.white_100,
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
    color: colors.white_100,
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
    backgroundColor: colors.blue_100,
    borderRadius: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  loginBtnText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 20,
    color: colors.white_100,
  },
  signUpText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 15,
    color: colors.white_100,
  },
  signUpTextLink: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 15,
    color: colors.blue_50,
    textDecorationLine: 'underline'
  },
});

export default RegisterScreen;

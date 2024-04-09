import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Home from '~/screens/home';
import LoginScreen from '~/screens/login';
import RegisterScreen from '~/screens/register';
import Graphic from '~/screens/graphic';
import Transactions from '~/screens/transactions'

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Graphic: undefined;
  Transactions: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Graphic"
          component={Graphic}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Transactions"
          component={Transactions}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

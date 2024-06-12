import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Home from '~/screens/home';
import LoginScreen from '~/screens/login';
import RegisterScreen from '~/screens/register';
import Graphic from '~/screens/graphic';
import Transactions from '~/screens/transactions';
import CardDatails from '~/screens/cardDatails';
import MonthlyBalance from '~/screens/monthlyBalance';
import CategoryGraphic from '~/screens/categoryGraphic';
import GraphicTeste from '~/screens/graphicTeste';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Graphic: undefined;
  Transactions: undefined;
  CardDatails: undefined;
  MonthlyBalance: undefined;
  CategoryGraphic: undefined;
  GraphicTeste: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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
        <Stack.Screen
          name="CardDatails"
          component={CardDatails}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="MonthlyBalance"
          component={MonthlyBalance}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CategoryGraphic"
          component={CategoryGraphic}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GraphicTeste"
          component={GraphicTeste}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

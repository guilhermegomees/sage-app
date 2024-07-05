import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Home from '~/screens/Home';
import LoginScreen from '~/screens/Login';
import RegisterScreen from '~/screens/Register';
import ChartList from '~/screens/ChartList';
import Transactions from '~/screens/Transactions';
import CardDatails from '~/screens/CardDatails';
import MonthlyBalance from '~/screens/MonthlyBalance';
import CategoryGraphic from '~/screens/CategoryGraphic';
import MainTabNavigator from '~/navigation/MainTabNavigator';

export type RootStackParamList = {
  Home: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  ChartList: undefined;
  Transactions: undefined;
  CardDatails: undefined;
  MonthlyBalance: undefined;
  CategoryGraphic: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
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
          name="ChartList"
          component={ChartList}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

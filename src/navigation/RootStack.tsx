import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import LoginScreen from '~/screens/Login';
import RegisterScreen from '~/screens/Register';
import Transactions from '~/screens/Transactions';
import CardDetails from '~/screens/CardDetails';
import MonthlyBalance from '~/screens/MonthlyBalance';
import CategoryGraphic from '~/screens/CategoryGraphic';
import MainTabNavigator from '~/navigation/MainTabNavigator';
import NewTransaction from '~/screens/NewTransaction';

export type RootStackParamList = {
    Home: undefined;
    Main: undefined;
    Login: undefined;
    Register: undefined;
    ChartList: undefined;
    Transactions: undefined;
    CardDetails: undefined;
    MonthlyBalance: undefined;
    CategoryGraphic: undefined;
    NewTransaction: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Main"
                    component={MainTabNavigator}
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
                    name="Transactions"
                    component={Transactions}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="CardDetails"
                    component={CardDetails}
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
                    name="NewTransaction"
                    component={NewTransaction}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

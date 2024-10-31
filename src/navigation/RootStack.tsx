import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import MainTabNavigator from '~/navigation/MainTabNavigator';
import LoginScreen from '~/screens/Login';
import RegisterScreen from '~/screens/Register';
import CardDetails from '~/screens/CardDetails';
import Profile from '~/screens/Profile';
import Accounts from '~/screens/Accounts';
import { AccountProvider } from '~/context/AccountContext';
import { GoalProvider } from '~/context/goalContext';
import { CreditCardsProvider } from '~/context/CreditCardContext';

const Stack = createStackNavigator();

export default function RootStack() {
    return (
        <AccountProvider>
            <CreditCardsProvider>
                <GoalProvider>
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
                                name="CardDetails"
                                component={CardDetails}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="Profile"
                                component={Profile}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="Account"
                                component={Accounts}
                                options={{ headerShown: false }}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </GoalProvider>
            </CreditCardsProvider>
        </AccountProvider>
    );
}

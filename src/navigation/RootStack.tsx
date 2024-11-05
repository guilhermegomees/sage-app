import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import MainTabNavigator from '~/navigation/MainTabNavigator';
import LoginScreen from '~/screens/Login';
import RegisterScreen from '~/screens/Register';
import Profile from '~/screens/Profile';
import Accounts from '~/screens/Accounts';
import Goals from '~/screens/Goals'
import { AccountProvider } from '~/context/AccountContext';
import { GoalProvider } from '~/context/GoalContext';
import { CreditCardsProvider } from '~/context/CreditCardContext';
import { TransactionProvider } from '~/context/TransactionContext';
import Categories from '~/screens/Categories';
import CreditCardDetails from '~/screens/CreditCardDetails';
import CreditCards from '~/screens/CreditCards';

const Stack = createStackNavigator();

export default function RootStack() {
    return (
        <AccountProvider>
            <TransactionProvider>
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
                                    name="CreditCardDetails"
                                    component={CreditCardDetails}
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name="CreditCards"
                                    component={CreditCards}
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name="Profile"
                                    component={Profile}
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name="Accounts"
                                    component={Accounts}
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name="Categories"
                                    component={Categories}
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name="Goals"
                                    component={Goals}
                                    options={{ headerShown: false }}
                                />
                            </Stack.Navigator>
                        </NavigationContainer>
                    </GoalProvider>
                </CreditCardsProvider>
            </TransactionProvider>
        </AccountProvider>
    );
}

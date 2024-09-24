import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Accounts from '~/screens/Accounts';
import NewTransaction from '~/screens/NewTransaction';
import { HeaderProvider } from '~/context/HeaderContext';

const HomeStackNavigator = createStackNavigator();

export default function HomeStack() {
    return (
        <HeaderProvider>
            <HomeStackNavigator.Navigator
                initialRouteName='Accounts'
                screenOptions={{
                    headerShown: false
                }}
            >
                <HomeStackNavigator.Screen name="Accounts" component={Accounts} />
                <HomeStackNavigator.Screen name="NewTransaction" component={NewTransaction} />
            </HomeStackNavigator.Navigator>
        </HeaderProvider>
    );
}
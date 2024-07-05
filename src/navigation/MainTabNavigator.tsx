import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '~/screens/Home';
import Transactions from '~/screens/Transactions';
import ChartList from '~/screens/ChartList';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator initialRouteName="Home">
            <Tab.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Transactions"
                component={Transactions}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Graphic"
                component={ChartList}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    );
}
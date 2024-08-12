import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ChartsTabNavigator from '../components/ChartsTabNavigator';
import MonthlyBalance from '../screens/MonthlyBalance';
import CategoryGraphic from '../screens/CategoryGraphic';
import React from 'react';

const Tab = createMaterialTopTabNavigator();

export default function ChartsTab() {
    return (
        <Tab.Navigator
            tabBar={(props) => <ChartsTabNavigator {...props} />}
            screenOptions={{
                swipeEnabled: false, // Desativa a navegação por gestos (arrastar)
            }}
        >
            <Tab.Screen name="CategoryGraphic" component={CategoryGraphic} options={{ title: 'chart-arc' }} />
            <Tab.Screen name="MonthlyBalance" component={MonthlyBalance} options={{ title: 'chart-bar' }} />
            <Tab.Screen name="ChartLine" component={CategoryGraphic} options={{ title: 'chart-line' }} />
        </Tab.Navigator>
    );
}
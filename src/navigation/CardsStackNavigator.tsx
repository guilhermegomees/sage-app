import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Cards from '~/screens/Cards';
import CardDatails from '~/screens/CardDetails';

const CardsStackNavigator = createStackNavigator();

export default function CardsStack() {
    return (
        <CardsStackNavigator.Navigator
            initialRouteName='Cards'
            screenOptions={{
                headerShown: false
            }}
        >
            <CardsStackNavigator.Screen name="Cards" component={Cards} />
            <CardsStackNavigator.Screen name="CardDetails" component={CardDatails} />
        </CardsStackNavigator.Navigator>
    );
}
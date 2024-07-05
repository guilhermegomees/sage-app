import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import TBar from '../components/TBar';
import Accounts from '../screens/Accounts';
import Goals from '../screens/Goals';
import Cards from '../screens/Cards';

import React from 'react';

const Tab = createMaterialTopTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TBar {...props} />}
      screenOptions={{
        swipeEnabled: false, // Desativa a navegação por gestos (arrastar)
      }}
    >
      <Tab.Screen name="Accounts" component={Accounts} options={{ tabBarLabel: 'Contas' }} />
      <Tab.Screen name="Goals" component={Goals} options={{ tabBarLabel: 'Metas' }} />
      <Tab.Screen name="Cards" component={Cards} options={{ tabBarLabel: 'Cartões' }} />
    </Tab.Navigator>
  );
}
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

// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// import HomeTabNavigator from '../components/HomeTabNavigator';
// import Accounts from '../screens/Accounts';
// import Goals from '../screens/Goals';
// import Cards from '../screens/Cards';

// import React from 'react';

// const Tab = createMaterialTopTabNavigator();

// export default function Tabs() {
//     return (
//         <Tab.Navigator
//             tabBar={(props) => <HomeTabNavigator {...props} />}
//             screenOptions={{
//                 swipeEnabled: false, // Desativa a navegação por gestos (arrastar)
//             }}
//         >
//             <Tab.Screen name="Accounts" component={Accounts} options={{ tabBarLabel: 'Contas' }} />
//             <Tab.Screen name="Goals" component={Goals} options={{ tabBarLabel: 'Metas' }} />
//             {/* <Tab.Screen name="Cards" component={Cards} options={{ tabBarLabel: 'Cartões' }} /> */}
//         </Tab.Navigator>
//     );
// }
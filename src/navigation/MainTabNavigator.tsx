import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomFabBar } from 'rn-wave-bottom-bar';
import { FontAwesome6 } from '@expo/vector-icons';
import Transactions from '~/screens/Transactions';
import Goals from '~/screens/Goals';
import ChartsTab from './ChartsTabNavigator';
import colors from '~/css/colors';
import Cards from '~/screens/Cards';
import Home from '~/screens/Home';
import { HeaderProvider } from '~/context/HeaderContext';
import { TransactionProvider } from '~/context/TransactionContext';
import { AccountProvider } from '~/context/AccountContext';

const Tab = createBottomTabNavigator();

const tabBarIcon = (name: any) => () => <FontAwesome6 name={name} size={22} color={colors.white} />;

export default function MainTabNavigator(){
    return (
        <TransactionProvider>
            <AccountProvider>
                <HeaderProvider>
                    <Tab.Navigator
                        initialRouteName="Home"
                        screenOptions={{
                            headerShown: false,
                            tabBarActiveTintColor: colors.gray_700,
                            tabBarActiveBackgroundColor: colors.gray_700,
                            tabBarLabelStyle: {
                                color: 'white',
                                fontFamily: 'Outfit_400Regular',
                                fontSize: 13
                            },
                        }}
                        tabBar={(props) => (
                            <BottomFabBar
                                mode='default'
                                isRtl={false}
                                focusedButtonStyle={{
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 0,
                                        height: 7,
                                    },
                                    shadowOpacity: 0.41,
                                    shadowRadius: 9.11,
                                    elevation: 14,
                                }}
                                bottomBarContainerStyle={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                }}
                                {...props}
                            />
                        )}
                    >
                        <Tab.Screen
                            name="Home"
                            component={Home}
                            options={{
                                tabBarIcon: tabBarIcon('house'),
                                tabBarLabel: 'Home',
                            }}
                        />
                        <Tab.Screen
                            name="Transactions"
                            component={Transactions}
                            options={{
                                tabBarIcon: tabBarIcon('arrow-right-arrow-left'),
                                tabBarLabel: 'Transações',
                            }}
                        />
                        <Tab.Screen
                            name="ChartList"
                            component={ChartsTab}
                            options={{
                                tabBarIcon: tabBarIcon('chart-line'),
                                tabBarLabel: 'Gráficos',
                            }}
                        />
                        <Tab.Screen
                            name="Cards"
                            component={Cards}
                            options={{
                                tabBarIcon: tabBarIcon('credit-card'),
                                tabBarLabel: 'Cartões',
                            }}
                        />
                        <Tab.Screen
                            name="Goals"
                            component={Goals}
                            options={{
                                tabBarIcon: tabBarIcon('bullseye'),
                                tabBarLabel: 'Metas',
                            }}
                        />
                    </Tab.Navigator>
                </HeaderProvider>
            </AccountProvider>
        </TransactionProvider>
    );
}
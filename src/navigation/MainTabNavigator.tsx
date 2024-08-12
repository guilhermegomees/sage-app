import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, colors } from '~/imports';
import { BottomFabBar } from 'rn-wave-bottom-bar';
import { Octicons } from '@expo/vector-icons';
import HomeStack from './HomeStackNavigator';
import Transactions from '~/screens/Transactions';
import Goals from '~/screens/Goals';
import ChartsTab from './ChartsTabNavigator';
import CardsStack from './CardsStackNavigator';

type ScreenComponent = () => JSX.Element;

interface ScreensMap {
    HomeStack: ScreenComponent;
    Transactions: ScreenComponent;
    Goals: ScreenComponent;
    ChartsTab: ScreenComponent;
    CardsStack: ScreenComponent;
};

const screensMap: ScreensMap = {
    HomeStack,
    Transactions,
    Goals,
    ChartsTab,
    CardsStack
};

const generateScreen = (screen: keyof ScreensMap): ScreenComponent => {
    const ScreenComponent = screensMap[screen];
    if (!ScreenComponent) {
        throw new Error(`Unknown screen: ${screen}`);
    }
    return ScreenComponent;
};

const Tab = createBottomTabNavigator();

const tabBarIcon =
    (name: any) =>
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ focused, color, size } : {
            focused: boolean;
            color: string;
            size: number;
        }) =>
            <Octicons name={name} size={25} color={colors.white} />;

export default function MainTabNavigator(){
    return (
        <Tab.Navigator 
            initialRouteName="HomeStack"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.gray_700,
                tabBarActiveBackgroundColor: colors.gray_700,
                tabBarInactiveBackgroundColor: 'red',
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
                name="HomeStack"
                component={generateScreen('HomeStack')}
                options={{
                    tabBarIcon: tabBarIcon('home'),
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen
                name="Transactions"
                component={generateScreen('Transactions')}
                options={{
                    tabBarIcon: tabBarIcon('arrow-switch'),
                    tabBarLabel: 'Transações',
                }}
            />
            <Tab.Screen
                name="ChartList"
                component={generateScreen('ChartsTab')}
                options={{
                    tabBarIcon: tabBarIcon('graph'),
                    tabBarLabel: 'Gráficos',
                }}
            />
            <Tab.Screen
                name="CardsStack"
                component={generateScreen('CardsStack')}
                options={{
                    tabBarIcon: tabBarIcon('credit-card'),
                    tabBarLabel: 'Cartões',
                }}
            />
            <Tab.Screen
                name="Goals"
                component={generateScreen('Goals')}
                options={{
                    tabBarIcon: tabBarIcon('rocket'),
                    tabBarLabel: 'Metas',
                }}
            />
        </Tab.Navigator>
    );
}
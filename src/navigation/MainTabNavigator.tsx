import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Image, colors, View, Text, base } from '~/imports';

import Home from '~/screens/Home';
import Transactions from '~/screens/Transactions';
import ChartList from '~/screens/ChartList';
import Cards from '~/screens/Cards';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator 
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarActiveTintColor: "#121212",
                tabBarStyle: {
                    backgroundColor: colors.gray_900,
                    borderTopWidth: 0,
                    height: 75
                }
            }}  
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <View style={[base.alignItemsCenter, base.justifyContentCenter, base.gap_3]}>
                            <Image
                                source={require('./../assets/images/tabBar/home.png')}
                                style={[{ width: 22, height: 22 }]}
                                tintColor={focused ? colors.gray_150 : colors.gray_500 }
                            />
                            <Text style={[styles.text, { color: focused ? colors.gray_150 : colors.gray_500  }]}>Início</Text>
                        </View>
                    },
                }}
            />
            <Tab.Screen
                name="Transactions"
                component={Transactions}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <View style={[base.alignItemsCenter, base.justifyContentCenter, base.gap_3]}>
                            <Image
                                source={require('./../assets/images/tabBar/transactions.png')}
                                style={[{ width: 20, height: 20 }]}
                                tintColor={focused ? colors.gray_150 : colors.gray_500 }
                            />
                            <Text style={[styles.text, { color: focused ? colors.gray_150 : colors.gray_500  }]}>Transações</Text>
                        </View>
                    },
                }}
            />
            <Tab.Screen
                name="New"
                component={Cards}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <>
                            <View style={[styles.containerBtnPlus, { backgroundColor: focused ? '#F37C4A' : '#EE8B60' }]}>
                                <Image
                                    source={require('./../assets/images/tabBar/plus.png')}
                                    style={[{ width: 26, height: 26 }]}
                                    tintColor={'#FFFFFF'}
                                />
                            </View>
                        </>
                    },
                }}
            />
            <Tab.Screen
                name="Card"
                component={Cards}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <View style={[base.alignItemsCenter, base.justifyContentCenter, base.gap_3]}>
                            <Image
                                source={require('./../assets/images/tabBar/card.png')}
                                style={[{ width: 23, height: 18 }]}
                                tintColor={focused ? colors.gray_150 : colors.gray_500 }
                            />
                            <Text style={[styles.text, { color: focused ? colors.gray_150 : colors.gray_500  }]}>Cartões</Text>
                        </View>
                    },
                }}
            />
            <Tab.Screen
                name="ChartList"
                component={ChartList}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <View style={[base.alignItemsCenter, base.justifyContentCenter, base.gap_3]}>
                            <Image
                                source={require('./../assets/images/tabBar/chart.png')}
                                style={[{ width: 22, height: 22 }]}
                                tintColor={focused ? colors.gray_150 : colors.gray_500 }
                            />
                            <Text style={[styles.text, { color: focused? colors.gray_150 : colors.gray_500  }]}>Graficos</Text>
                        </View>
                    },
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    containerBtnPlus: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        shadowColor: 'red',
        marginBottom: 50,
    },
    text: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 14
    }
});
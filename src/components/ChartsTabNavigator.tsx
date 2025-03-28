import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import colors from '~/css/colors';

interface CustomTabBarProps {
    state: any; // Defina o tipo correto para state e descriptors conforme necessário
    descriptors: any;
    navigation: any;
}

export function ChartsTabNavigator({ state, descriptors, navigation }: CustomTabBarProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.buttonTab}
                        >
                            <View style={{ alignItems: 'center', padding: 4 }}>
                                <View
                                    style={{
                                        alignItems: 'center',
                                        width: 70,
                                        padding: 8,
                                        borderRadius: 99,
                                        backgroundColor: isFocused ? colors.gray_800 : 'transparent',
                                    }}
                                >
                                    <FontAwesome6
                                        name={options.title}
                                        size={23}
                                        color={isFocused ? colors.gray_100 : colors.gray_500}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15
    },
    content: {
        marginBottom: Platform.OS === 'ios' ? 14 : 3,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        backgroundColor: colors.gray_700,
        flexDirection: 'row',
        borderRadius: 99,
        gap: 30,
    },
    buttonTab: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChartsTabNavigator;
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { base } from "../css/base";
import { colors } from "../css/colors";

const TabBarHome: React.FC<any> = ({ state, descriptors, navigation }: any) => {
    return (
        <View style={[styles.container]}>
            <View style={[base.flexRow, base.flexSpaceBetween, base.py_5, base.px_5, base.rounded_95, base.w_100, { height: 58, backgroundColor: colors.gray_800 }]}>
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
            
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

                    return (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            style={[
                                {backgroundColor: isFocused ? colors.orange_300 : 'transparent'},
                                base.rounded_95,
                                base.alignItemsCenter,
                                base.justifyContentCenter,
                            ]}
                            key={route.key}
                        >
                            <Text style={[styles.label]}>{label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
        height: 58,
        paddingHorizontal: 80
    },
    label: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        paddingHorizontal: 30,
        color: colors.gray_50
    }
})

export default TabBarHome;
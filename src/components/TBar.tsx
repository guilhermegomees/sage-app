import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { base } from "../css/base";
import { colors } from "../css/colors";

const TBar: React.FC<any> = ({ state, descriptors, navigation }: any) => {
    return (
        <View style={[styles.container, base.px_30]}>
            <View style={[base.flexRow, base.flexSpaceBetween, base.py_10, base.px_10, base.rounded_95, base.w_100, { height: 58, backgroundColor: colors.gray_800 }]}>
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
        height: 58
    },
    label: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        paddingHorizontal: 20,
        color: colors.white_100
    }
})

export default TBar;
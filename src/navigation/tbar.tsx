import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { base } from "../css/base";
import { colors } from "../css/colors";

const TBar: React.FC<any> = ({ state, descriptors, navigation }: any) => {
    return (
        <View style={[styles.container, base.flexRow, base.flexSpaceBetween, base.px_10, base.py_10, base.rounded_95]}>
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
                        style={[{backgroundColor: isFocused ? colors.orange_300 : 'transparent'}, base.rounded_95, base.alignItemsCenter, base.justifyContentCenter]}
                        key={route.key}
                    >
                        <Text style={[styles.text, base.fw_500, base.fs_medium, base.px_20]}>{label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_800,
        height: 58
    },
    text: {
        color: colors.white_100
    }
})

export default TBar;
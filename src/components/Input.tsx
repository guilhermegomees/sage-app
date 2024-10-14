import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import colors from "~/css/colors";

interface InputProps extends TextInputProps {
    value: string;
    onChangeText: React.Dispatch<React.SetStateAction<string>>;
    icon?: string;
    styleInput?: object;
    styleTextInput?: object;
}

const Input: React.FC<InputProps> = ({value, onChangeText, icon, styleInput, styleTextInput, ...props}) => {
    return (
        <View style={[styleInput || styles.input]}>
            <TextInput
                style={styleTextInput || styles.inputText}
                placeholder={props.placeholder}
                placeholderTextColor={props.placeholderTextColor || colors.gray_200}
                value={value}
                onChangeText={onChangeText}
                keyboardType={props.keyboardType}
            />
            {icon && <FontAwesome6 name={icon} size={20} color={colors.gray_200} />}
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        backgroundColor: colors.gray_900,
        borderRadius: 15,
        height: 50,
        alignItems: 'center',
        paddingHorizontal: 15,
        flexDirection: "row"
    },
    inputText: {
        fontFamily: 'Outfit_500Medium',
        height: 50,
        color: colors.white,
        flex: 1,
        fontSize: 16
    },
})

export default Input;
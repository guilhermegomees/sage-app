import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, TextInput, View, TextInputProps } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import colors from "~/css/colors";

interface PasswordInputProps extends TextInputProps {
    value: string;
    onChangeText: React.Dispatch<React.SetStateAction<string>>;
    styleInput?: object;
    styleTextInput?: object;
}

const PasswordInput: React.FC<PasswordInputProps> = ({value, onChangeText, styleInput, styleTextInput, ...props}) => {
    const [showPassword, setShowPassword] = useState(false); // Controle de visibilidade da senha

    return (
        <View style={[styleInput || styles.input]}>
            <TextInput
                style={styleTextInput || styles.inputText}
                placeholder={props.placeholder || "Senha"}
                placeholderTextColor={props.placeholderTextColor || colors.gray_200}
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChangeText}
            />
            <TouchableOpacity onPress={() => {setShowPassword(!showPassword)}}>
                <FontAwesome6 name={showPassword ? 'eye-slash' : 'eye'} size={20} color={colors.gray_200} />
            </TouchableOpacity>
        </View>
    );
};

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
});

export default PasswordInput;
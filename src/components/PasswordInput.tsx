import React, { useState, createRef } from "react";
import { TouchableOpacity, StyleSheet, TextInput, View, Platform, Text, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import base from "~/css/base";
import colors from "~/css/colors";

const PasswordInput: React.FC<any> = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [overlay, setOverlay] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Controle de visibilidade da senha
    const inputRef = createRef<any>();

    function setVisibility() {
        setModalVisible(!modalVisible);
        setOverlay(!overlay);
        props.overlay(!overlay);
    }

    function setFocus() {
        if (Platform.OS === 'android') {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }

    function toggleShowPassword() {
        setShowPassword(!showPassword); // Alterna a visibilidade da senha
    }

    function getDisplayValue() {
        if (!showPassword && props.value) {
            return '•'.repeat(props.value?.length || 0);
        }
        return props.value || props.placeholder;
    }

    return (
        <TouchableOpacity style={[props.style, props.containerStyle]} activeOpacity={1} onPress={setVisibility}>
            <Text style={[base.inputText, props.textStyle, {color: props.value ? colors.white : colors.gray_200}]}>
                {getDisplayValue()}
            </Text>
            <TouchableOpacity onPress={toggleShowPassword} style={[base.w_10, base.h_100, base.alignItemsEnd, base.justifyContentCenter]}>
                <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={20}
                    color={colors.gray_200}
                />
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                onRequestClose={setVisibility}
                onShow={setFocus}
                animationType="slide"
                transparent
            >
                <SafeAreaView style={[base.flex_1]}>
                    <TouchableOpacity style={[styles.outside]} onPress={setVisibility} />
                    <View
                        style={[
                            styles.inputWrapper,
                            { backgroundColor: props.inputWrapperColor ?? colors.gray_900 },
                            { flexDirection: 'row' },
                        ]}
                    >
                        <View style={[base.input, base.flexRow]}>
                            <TextInput
                                {...props}
                                style={[base.inputText]}
                                placeholderTextColor={colors.gray_200}
                                ref={inputRef}
                                autoFocus={Platform.OS === 'ios'}
                                onBlur={setVisibility}
                                onSubmitEditing={setVisibility}
                                secureTextEntry={!showPassword} // Controle de visibilidade da senha
                            />
                            <TouchableOpacity onPress={toggleShowPassword}>
                                <MaterialIcons
                                    name={showPassword ? 'visibility-off' : 'visibility'}
                                    size={20}
                                    color={colors.gray_200}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    inputWrapper: {
        flex: Platform.OS === 'ios' ? 1 : 0,
        paddingTop: 20,
        paddingBottom: Platform.OS === 'ios' ? 0 : 20,
        paddingHorizontal: 15,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    outside: {
        flex: 1
    },
});

export default PasswordInput;
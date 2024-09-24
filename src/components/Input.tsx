import React, { createRef, useState } from "react";
import { TouchableOpacity, StyleSheet, Text, Modal, TextInput, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { base, colors, MaterialIcons } from "~/imports";

const Input: React.FC<any> = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [overlay, setOverlay] = useState(false);
    const inputRef = createRef<any>();

    function setVisibility(){
        setModalVisible(!modalVisible);
        setOverlay(!overlay);
        props.overlay(!overlay);
    }

    function setFocus(){
        if(Platform.OS === 'android'){
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }

    return (
        <TouchableOpacity style={[props.style, props.containerStyle]} activeOpacity={1} onPress={setVisibility}>
            <Text style={[base.inputText, props.textStyle, {color: props.value ? colors.white : colors.gray_200}]}>
                {props.value || props.placeholder}
            </Text>
            { props.icon && <MaterialIcons name={props.icon} size={20} color={colors.gray_200} /> }
            <Modal
                visible={modalVisible} 
                onRequestClose={setVisibility}
                onShow={setFocus}
                animationType="slide"
                transparent
            >
                <SafeAreaView style={[base.flex_1]}>
                    <TouchableOpacity style={[styles.outside]} onPress={setVisibility}/>
                    <View 
                        style={[
                            styles.inputWrapper,
                            {backgroundColor: props.inputWrapperColor ?? colors.gray_900},
                            {flexDirection: props.icon && 'row'},
                            {backgroundColor: props.inputWrapperColor ?? colors.gray_900}
                        ]}
                    >
                        <View style={[base.input]}>
                            <TextInput
                                {...props}
                                style={[base.inputText]}
                                placeholderTextColor={colors.gray_200}
                                ref={inputRef}
                                autoFocus={Platform.OS === 'ios'}
                                onBlur={setVisibility}
                                onSubmitEditing={setVisibility}
                            />
                            { props.icon && <MaterialIcons name={props.icon} size={20} color={colors.gray_200} /> }
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        borderRadius: 4,
        borderColor: '#eee',
        borderWidth: 1,
        height: 35,
        justifyContent: "center",
        paddingHorizontal: 10
    },
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
})

export default Input;
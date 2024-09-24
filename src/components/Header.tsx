import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { HeaderContext } from '~/context/HeaderContext';
import NewTransaction from '~/screens/NewTransaction';
import { MaterialIcons } from '@expo/vector-icons';
import base from '~/css/base';
import colors from '~/css/colors';

const { width, height } = Dimensions.get('window');

export default function Header() {
    const { showValues, setShowValues } = useContext(HeaderContext);
    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const toggleShowValues = () => {
        setShowValues(!showValues);
    }

    return (
        <>
            <View style={[base.flexRow, base.flexSpaceBetween, base.alignItemsCenter, base.px_30, styles.container]}>
                <View style={[base.flexRow, base.alignItemsCenter, base.gap_12]}>
                    <View style={[base.gap_4]}>
                        <Text style={styles.text}>Olá [Nome]</Text>
                    </View>
                </View>
                <View style={[base.flexRow, base.gap_20]}>
                    <TouchableOpacity onPress={toggleShowValues}>
                        <MaterialIcons
                            name={showValues ? 'visibility' : 'visibility-off'}
                            size={28}
                            color={colors.gray_50} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleModal}>
                        <MaterialIcons name='add' size={28} color={colors.gray_50} />
                    </TouchableOpacity>
                </View>
            </View>
            <NewTransaction isModalVisible={isModalVisible} onClose={toggleModal} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
        paddingTop: 25,
    },
    text: {
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_50,
        fontSize: 16,
    },
    iconUser: {
        width: 40,
        height: 40,
    },
    containerModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modal: {
        backgroundColor: colors.gray_875,
        flex: 0.94,
        borderRadius: 15,
        padding: 20
    },
    containerBack: {
        height: 30,
        backgroundColor: colors.gray_925,
        borderRadius: 20
    },
    containerBtnActions: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancel: {
        fontFamily: 'Outfit_500Medium',
        color: colors.orange_300,
        fontSize: 16
    },
    save: {
        fontFamily: 'Outfit_500Medium',
        color: colors.blue_400,
        fontSize: 16
    },
    containerValue: {
        marginTop: 25,
        gap: 5
    },
    value: {
        height: 40,
        fontSize: 28,
        color: colors.red_500,
        fontFamily: 'Outfit_600SemiBold'
    },
    iconContainer: {
        marginLeft: 8,
    },
    input: {
        backgroundColor: colors.gray_800,
        borderRadius: 12,
        textAlignVertical: 'top',
        padding: 15,
        fontFamily: 'Outfit_500Medium',
        color: colors.white,
        fontSize: 15,
    },
    overlay: {
        width,
        height
    },
});
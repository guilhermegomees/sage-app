import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HeaderContext } from '~/context/HeaderContext';
import NewTransaction from '~/screens/NewTransaction';
import { MaterialIcons } from '@expo/vector-icons';
import base from '~/css/base';
import colors from '~/css/colors';

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
                        <Text style={styles.name}>Olá [Nome]</Text>
                    </View>
                </View>
                <View style={[base.flexRow, base.gap_20]}>
                    <TouchableOpacity onPress={toggleShowValues}>
                        <MaterialIcons
                            name={showValues ? 'visibility' : 'visibility-off'}
                            size={28}
                            color={colors.gray_50} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={toggleModal}>
                        <MaterialIcons name='add' size={28} color={colors.gray_50} />
                    </TouchableOpacity> */}
                </View>
            </View>
            {/* <NewTransaction isModalVisible={isModalVisible} onClose={toggleModal} /> */}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
        paddingTop: 25,
    },
    name: {
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_50,
        fontSize: 16,
    },
});
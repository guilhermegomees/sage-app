import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { HeaderContext } from '~/context/HeaderContext';
import { FontAwesome6 } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import base from '~/css/base';
import colors from '~/css/colors';
import useUser from '~/hooks/useUser';

type HeaderNavigationProp = StackNavigationProp<any, 'Header'>;

export default function Header() {
    const navigation = useNavigation<HeaderNavigationProp>();
    const user = useUser();
    const { showValues, setShowValues } = useContext(HeaderContext);

    const toggleShowValues = () => {
        setShowValues(!showValues);
    }

    const handleNavigateToProfile = () => {
        navigation.navigate('Profile');
    }

    return (
        <View style={[base.flexRow, base.flexSpaceBetween, base.alignItemsCenter, base.px_30, styles.container]}>
            <View style={[base.flexRow, base.alignItemsCenter, base.gap_10]}>
                <TouchableOpacity onPress={handleNavigateToProfile}>
                    <View style={[styles.containerPhoto]}>
                        <Image 
                            source={user?.photoURL
                                ? { uri: user?.photoURL }
                                : require("./../assets/images/blank-profile-picture.png")}
                            style={[styles.userPhoto]}
                        />
                    </View>
                </TouchableOpacity>
                <View style={[base.gap_2]}>
                    <Text style={styles.textHello}>Olá,</Text>
                    <Text style={styles.userName}>{user?.name}</Text>
                </View>
            </View>
            <View style={[styles.containerEye]}>
                <TouchableOpacity onPress={toggleShowValues}>
                    <FontAwesome6
                        name={!showValues ? 'eye-slash' : 'eye'}
                        size={21}
                        color={colors.gray_50}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
        paddingTop: 25,
    },
    containerPhoto: {
        borderRadius: 100,
    },
    userPhoto: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    textHello: {
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_50,
        fontSize: 15,
    },
    userName: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.gray_50,
        fontSize: 17,
    },
    containerEye: {
        width: 35,
        alignItems: 'center',
    },
});
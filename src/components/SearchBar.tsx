import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '~/imports';

const SearchBar = () => {
    return (
        <View style={[styles.searchSection, {backgroundColor: colors.gray_800}]}>
            <Ionicons name="search" size={18} color={colors.gray_200} />
            <TextInput
                style={[styles.input]}
                placeholder="Pesquisa"
                underlineColorAndroid="transparent"
                placeholderTextColor={colors.gray_200}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 35,
        gap: 7
    },
    input: {
        fontFamily: 'Outfit_400Regular',
        flex: 1,
        height: '100%',
        fontSize: 13,
        paddingVertical: 0
    },
});

export default SearchBar;
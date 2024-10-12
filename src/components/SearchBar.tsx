import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '~/css/colors';
import { FontAwesome6 } from '@expo/vector-icons';

interface SearchBarProps {
    searchValue: string; 
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchValue, setSearchValue }) => {
    return (
        <View style={[styles.searchSection, {backgroundColor: colors.gray_800}]}>
            <FontAwesome6 name="magnifying-glass" size={18} color={colors.gray_300} />
            <TextInput
                style={[styles.input, { color: colors.gray_100 }]}
                placeholder="Pesquisar"
                placeholderTextColor={colors.gray_300}
                value={searchValue}
                onChangeText={setSearchValue}
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
        height: 50,
        gap: 10
    },
    input: {
        fontFamily: 'Outfit_400Regular',
        flex: 1,
        height: '100%',
        fontSize: 15,
        paddingVertical: 0
    },
});

export default SearchBar;
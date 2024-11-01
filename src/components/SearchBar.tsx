import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import colors from '~/css/colors';
import { FontAwesome6 } from '@expo/vector-icons';
import base from '~/css/base';

interface SearchBarProps {
    searchItem: string;
    setSearchItem: (text: string) => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchItem, setSearchItem, placeholder }) => {
    return (
        <View style={[base.flexRow, base.alignItemsCenter, base.gap_15, base.py_18, styles.lineBottom]}>
            <View style={[styles.containerIcon, { backgroundColor: colors.gray_600 }]}>
                <FontAwesome6 name="magnifying-glass" color={colors.white} size={15} />
            </View>
            <TextInput
                placeholder={placeholder || 'Pesquisar'}
                placeholderTextColor={colors.gray_300}
                style={[styles.searchBar]}
                value={searchItem}
                onChangeText={setSearchItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    lineBottom: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray_700
    },
    containerIcon: {
        borderRadius: 50,
        padding: 10,
        width: 38,
        height: 38,
        justifyContent: "center",
        alignItems: "center"
    },
    searchBar: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 15,
        color: colors.gray_200
    },
});

export default SearchBar;
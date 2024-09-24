import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '~/css/colors';

interface SearchBarProps {
    onSearch: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchText, setSearchText] = useState('');

    const handleSearch = (text: string) => {
        setSearchText(text);
        onSearch(text);
    };
    
    return (
        <View style={[styles.searchSection, {backgroundColor: colors.gray_800}]}>
            <Ionicons name="search" size={18} color={colors.gray_300} />
            <TextInput
                style={[styles.input, { color: colors.gray_300 }]}
                placeholder="Pesquisa"
                placeholderTextColor={colors.gray_300}
                value={searchText}
                onChangeText={handleSearch}
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
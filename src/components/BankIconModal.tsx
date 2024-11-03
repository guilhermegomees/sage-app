import React from 'react';
import Modal from 'react-native-modal';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import SearchBar from './SearchBar';
import base from '~/css/base';
import colors from '~/css/colors';
import { banks } from '~/constants/banks';

interface IconModalProps {
    isVisible: boolean;
    searchItem: string;
    filteredBanks: string[];
    onSearch: (text: string) => void;
    onSelectIcon: (icon: string) => void;
    onClose: () => void;
}

const BankIconModal: React.FC<IconModalProps> = ({
    isVisible,
    searchItem,
    filteredBanks,
    onSearch,
    onSelectIcon,
    onClose
}) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            backdropOpacity={0.4}
            style={[base.justifyContentEnd, base.m_0]}
        >
            <View style={styles.accountsIconModal}>
                <Text style={styles.modalTitle}>Selecione o ícone do banco</Text>
                <SearchBar searchItem={searchItem} setSearchItem={onSearch} placeholder="Buscar ícone" />
                <FlatList
                    data={filteredBanks}
                    keyExtractor={(item) => item}
                    style={[base.mt_5]}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.bankItem}
                            onPress={() => onSelectIcon(item)}
                        >
                            <Image source={banks[item]} style={styles.bankIcon} />
                            <Text style={styles.bankName}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => (
                        <Text style={[styles.listEmpty]}>
                            Ops! Nenhum resultado para sua pesquisa.
                        </Text>
                    )}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    accountsIconModal: {
        backgroundColor: colors.gray_875,
        borderRadius: 20,
        padding: 20,
        flex: 0.8
    },
    modalTitle: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 18,
        color: colors.gray_50,
        marginBottom: 5
    },
    bankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    bankIcon: {
        width: 40,
        height: 40,
        marginRight: 15,
        borderRadius: 50
    },
    bankName: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        color: colors.gray_50
    },
    listEmpty: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        textAlign: 'center',
        color: colors.gray_150,
        marginTop: 20
    },
});

export default BankIconModal;
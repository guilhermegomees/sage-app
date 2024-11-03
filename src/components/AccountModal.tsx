import React from 'react';
import Modal from 'react-native-modal';
import { View, Text, TextInput, TouchableOpacity, Image, Switch, StyleSheet } from 'react-native';
import base from '~/css/base';
import colors from '~/css/colors';
import { FontAwesome6 } from '@expo/vector-icons';
import { formatCurrency, getBankLogo } from '~/utils/utils';

interface AccountModalProps {
    isVisible: boolean;
    isEditing: boolean;
    currentBalance: number;
    accountName: string | undefined;
    accountIcon?: string;
    includeInSum: boolean;
    onChangeBalance: (text: string) => void;
    onChangeAccountName: (text: string) => void;
    onToggleIncludeInSum: (value: boolean) => void;
    onSelectIcon: () => void;
    onClose: () => void;
    onSave: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({
    isVisible,
    isEditing,
    currentBalance,
    accountName,
    accountIcon,
    includeInSum,
    onChangeBalance,
    onChangeAccountName,
    onToggleIncludeInSum,
    onSelectIcon,
    onClose,
    onSave
}) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            backdropOpacity={0.5}
            style={[base.justifyContentEnd, base.m_0]}
        >
            <View style={styles.createAccountModal}>
                <View style={styles.containerValueInitial}>
                    <Text style={styles.currentBalanceLabel}>Saldo atual da conta</Text>
                    <TextInput
                        style={[styles.currentBalance]}
                        placeholder="R$ 0.00"
                        placeholderTextColor={colors.gray_100}
                        keyboardType="numeric"
                        onChangeText={onChangeBalance}
                        value={formatCurrency(currentBalance)}
                    />
                </View>
                <View style={[base.gap_10, base.mt_20]}>
                    <TextInput
                        style={[base.input, { backgroundColor: colors.gray_825 }]}
                        placeholder="Nome da conta"
                        placeholderTextColor={colors.gray_200}
                        onChangeText={onChangeAccountName}
                        value={accountName}
                        maxLength={25}
                    />
                    <TouchableOpacity style={[base.input, { backgroundColor: colors.gray_825 }]} onPress={onSelectIcon}>
                        <View style={[base.flexRow, base.alignItemsCenter, base.gap_15]}>
                            <View style={[base.alignItemsCenter, { width: 20 }]}>
                                {accountIcon ? (
                                    <Image source={getBankLogo(accountIcon)} style={[styles.accountIconModal]} />
                                ) : (
                                    <FontAwesome6 name="ellipsis" color={colors.gray_100} size={20} style={styles.ellipsisIcon} />
                                )}
                            </View>
                            <Text style={base.inputText}>{accountIcon || 'Ícone da conta'}</Text>
                        </View>
                        <FontAwesome6 name="angle-right" color={colors.gray_100} size={15} />
                    </TouchableOpacity>
                    <View style={[styles.toggleContainer]}>
                        <Text style={[styles.toggleLabel]}>Incluir na soma da tela inicial</Text>
                        <Switch
                            value={includeInSum}
                            onValueChange={onToggleIncludeInSum}
                            trackColor={{ false: colors.gray_600, true: colors.blue_800 }}
                            thumbColor={includeInSum ? colors.blue_600 : colors.gray_200}
                        />
                    </View>
                </View>
                <View style={[base.flexRow, base.justifyContentSpaceBetween, base.mt_30]}>
                    <TouchableOpacity style={[base.button, base.btnCancel]} onPress={onClose}>
                        <Text style={[base.btnText]}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[base.button, base.btnSave]} onPress={onSave}>
                        <Text style={[base.btnText]}>{isEditing ? 'Editar' : 'Criar conta'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    createAccountModal: {
        backgroundColor: colors.gray_875,
        flex: 0.45,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    containerValueInitial: {
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray_600
    },
    currentBalanceLabel: {
        color: colors.gray_200,
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
    },
    currentBalance: {
        height: 40,
        fontSize: 28,
        fontFamily: 'Outfit_600SemiBold',
        color: colors.gray_100
    },
    ellipsisIcon: {
        width: 18
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 5
    },
    toggleLabel: {
        fontFamily: "Outfit_500Medium",
        fontSize: 16,
        color: colors.gray_50,
    },
    accountIconModal: {
        borderRadius: 50,
        width: 25,
        height: 25
    },
});

export default AccountModal;
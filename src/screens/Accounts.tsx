import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useAccounts } from "~/context/AccountContext";
import { IAccount } from "~/interfaces/interfaces";
import { formatValue, getBankLogo } from "~/utils/utils";
import base from "~/css/base";
import colors from "~/css/colors";
import useUser from "~/hooks/useUser";
import { FontAwesome6 } from "@expo/vector-icons";

type AccountsScreenNavigationProp = StackNavigationProp<any, 'Accounts'>;

export default function Accounts(){
    const navigation = useNavigation<AccountsScreenNavigationProp>();

    const { accounts, fetchAccounts } = useAccounts();
    const user = useUser();
    
    useEffect(() => {
        if (user) {
            fetchAccounts(user);
        }
    }, [user]);

    const handleNavigateToBack = () => {
        navigation.goBack();
    }

    return (
        <View style={[styles.container]}>
            <View style={[styles.containerBack]}>
                <TouchableOpacity onPress={handleNavigateToBack} style={[styles.iconBack]}>
                    <FontAwesome6 name="angle-left" size={20} color={colors.gray_50} />
                </TouchableOpacity>
                <Text style={[styles.screenTitle]}>Contas</Text>
            </View>
            <View style={[base.gap_10]}>
                {accounts.map((account: IAccount)=>{
                    return (
                        <View key={account.id} style={[styles.account]}>
                            <View style={[base.flexRow, base.alignItemsCenter, base.gap_15]}>
                                <Image source={getBankLogo(account.bankName)} style={[styles.accountIcon]}/>
                                <Text style={[styles.accountText]}>{account.name}</Text>
                            </View>
                            <Text style={[styles.accountValue, { color: account.balance < 0 ? colors.red_500 : colors.green_500 }]}>R$ {formatValue(account.balance)}</Text>
                        </View>
                    )
                })}
            </View>
            <TouchableOpacity style={styles.fabButton} onPress={() => console.log('Adicionar nova conta')}>
                <FontAwesome6 name="plus" size={22} color={colors.gray_50} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray_900,
        paddingHorizontal: 30,
        paddingTop: 30
    },
    containerBack: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        marginBottom: 25,
        gap: 10
    },
    iconBack: {
        justifyContent: "center",
        width: 30,
        height: 30
    },
    screenTitle: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.gray_50,
        fontSize: 22,
    },
    account: {
        backgroundColor: colors.gray_800,
        borderRadius: 10,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 15,
    },
    accountIcon: {
        borderRadius: 50,
        width: 40,
        height: 40
    },
    accountText: {
        fontFamily: "Outfit_500Medium",
        fontSize: 18,
        color: colors.gray_50
    },
    accountValue: {
        fontFamily: "Outfit_500Medium",
        fontSize: 16,
        color: colors.gray_50
    },
    fabButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.blue_600,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
})
import { MaterialIcons, TouchableOpacity, View, Text, colors, StyleSheet, useNavigation, StackNavigationProp, base } from "~/imports";

type NewTransactionScreenNavigationProp = StackNavigationProp<any, 'NewTransaction'>;

export default function NewTransaction(){
    const navigation = useNavigation<NewTransactionScreenNavigationProp>();

    const handleNavigateToBack = () => {
        navigation.goBack();
    };

    return (
        <View style={[styles.container, base.flex_1, base.px_30]}>
            <View style={[styles.containerBack]}>
                <TouchableOpacity onPress={handleNavigateToBack}>
                    <MaterialIcons name="chevron-left" size={30} color={colors.gray_50} />
                </TouchableOpacity>
                <Text style={[styles.title]}>Nova Transação</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
    },
    containerBack: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 25,
    },
    title: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.gray_50,
        fontSize: 20,
        marginLeft: 10,
    },
})
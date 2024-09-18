import { useState } from "react";
import { Dimensions } from "react-native";
import Input from "~/components/Input";
import Overlay from "~/components/Overlay";
import { TouchableOpacity, View, Text, colors, StyleSheet, base } from "~/imports";
import Modal from "react-native-modal";

const { width, height } = Dimensions.get('window');

const NewTransaction: React.FC<any> = (props) => {
    const [value, setValue] = useState<number>(0);
    const [descript, setDescript] = useState<string>();
    const [overlay, setOverley] = useState(false);

    const formatCurrency = (num: number) => {
        return `R$ ${num.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const handleChange = (text: string) => {
        const rawValue = text.replace(/[^\d]/g, '');
        const numericValue = parseFloat(rawValue) / 100;

        setValue(numericValue);
    };

    return (
        <Modal
            isVisible={props.isModalVisible}
            onBackdropPress={props.onClose}
            swipeDirection="down"
            style={styles.containerModal}
        >
            <View style={[base.w_100, base.justifyContentCenter, base.px_25, { position: 'absolute', top: 34 }]}>
                <View style={[styles.containerBack]} />
            </View>
            <View style={[styles.modal]}>
                <View style={[styles.containerBtnActions]}>
                    <TouchableOpacity onPress={props.onClose}>
                        <Text style={[styles.cancel]}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={[styles.save]}>Salvar</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.containerValue]}>
                    <Text style={[styles.text, { fontSize: 15, color: colors.gray_400 }]}>Valor</Text>
                    <Input
                        style={styles.value}
                        textStyle={styles.value}
                        placeholder={'R$ 0.00'}
                        placeholderTextColor={colors.red_500}
                        keyboardType="numeric"
                        onChangeText={handleChange}
                        value={formatCurrency(value)}
                        overlay={(value: boolean) => setOverley(value)}
                    />
                </View>
                <View style={[base.mt_15, base.gap_15]}>
                    <Input
                        style={[styles.input, { height: 70 }]}
                        placeholder="Descrição"
                        placeholderTextColor="#F8F1F1"
                        onChangeText={setDescript}
                        value={descript}
                        maxLength={25}
                        overlay={(value: boolean) => setOverley(value)}
                    />
                </View>
            </View>
            {overlay && <Overlay style={[styles.overlay]} />}
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
        paddingTop: 25,
    },
    text: {
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_50,
        fontSize: 16,
    },
    iconUser: {
        width: 40,
        height: 40,
    },
    containerModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modal: {
        backgroundColor: colors.gray_875,
        flex: 0.94,
        borderRadius: 15,
        padding: 20
    },
    containerBack: {
        height: 30,
        backgroundColor: colors.gray_925,
        borderRadius: 20
    },
    containerBtnActions: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancel: {
        fontFamily: 'Outfit_500Medium',
        color: colors.orange_300,
        fontSize: 16
    },
    save: {
        fontFamily: 'Outfit_500Medium',
        color: colors.blue_400,
        fontSize: 16
    },
    containerValue: {
        marginTop: 25,
        gap: 5
    },
    value: {
        height: 40,
        fontSize: 28,
        color: colors.red_500,
        fontFamily: 'Outfit_600SemiBold'
    },
    iconContainer: {
        marginLeft: 8,
    },
    input: {
        backgroundColor: colors.gray_800,
        borderRadius: 12,
        textAlignVertical: 'top',
        padding: 15,
        fontFamily: 'Outfit_500Medium',
        color: colors.white,
        fontSize: 15,
    },
    overlay: {
        width,
        height
    },
})

export default NewTransaction;
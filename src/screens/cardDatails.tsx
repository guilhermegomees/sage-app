import { useState } from 'react';
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    colors,
    base,
    Image,
    MaterialIcons,
    useNavigation,
    StackNavigationProp,
    Platform,
} from '~/imports';

import { ScrollView, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import DayPicker from '~/components/DayPicker';
import Slider from '~/components/Slider';

type CardDatailsScreenNavigationProp = StackNavigationProp<any, 'CardDatails'>;

export default function CardDatails() {
    const navigation = useNavigation<CardDatailsScreenNavigationProp>();
    const defaultCardName = "Cartão 1"; // TODO: Trazer nome do cartão do banco de dados
    const [cardName, setcardName] = useState(defaultCardName);

    const handleNavigateToBack = () => {
        navigation.navigate('Home');
    };

    return (
        <KeyboardAwareScrollView style={[styles.container, base.flex_1]}>
            <View style={[base.px_30]}>
                {/* Seta para voltar */}
                <View style={[styles.containerBack]}>
                    <TouchableOpacity onPress={handleNavigateToBack}>
                        <MaterialIcons name="chevron-left" size={30} color={colors.gray_50} />
                    </TouchableOpacity>
                    <Text style={[styles.title]}>Detalhes</Text>
                </View>
                {/* Card */}
                <View style={[base.alignItemsCenter]}>
                    <View style={[styles.card]}>
                        <View style={[base.p_13, base.flexColumn, base.flexSpaceBetween, base.flex_1]}>
                            <View style={[styles.containerTop]}>
                                <Text style={[styles.cardName]}>{cardName}</Text>
                                <Image source={require('./../assets/images/contactless.png')} style={styles.contactless} />
                            </View>
                            <View style={[styles.containerChip]}>
                                <Image source={require('./../assets/images/chipcard.png')} style={styles.chipcard} />
                            </View>
                            <View style={[styles.containerBottom]}>
                                <Text style={[styles.sage]}>Sage</Text>
                            </View>
                        </View>
                    </View>
                </View>
                {/* Inputs */}
                <View style={[base.mt_30, base.gap_25]}>
                    <View style={[styles.input]}>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Nome do cartão"
                            placeholderTextColor="#F8F1F1"
                            onChangeText={(name) => setcardName(name)}
                            value={cardName}
                            maxLength={25}
                        />
                    </View>
                    <DayPicker />
                </View>
                {/* Slider */}
                <View style={[styles.sliderContainer]}>
                    <Slider />
                </View>
                {/* Botões */}
                <View style={[styles.buttonContainer]}>
                    <TouchableOpacity style={[styles.button, styles.btnCardRegister]}>
                        <Text style={[styles.btnText]}>Registrar cartão</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.btnCancel]}>
                        <Text style={[styles.btnText]}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Image
                source={require('../assets/images/imgFooter.png')}
                style={styles.backgroundImage}
            />
        </KeyboardAwareScrollView>
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
    card: {
        width: 330,
        height: 200,
        backgroundColor: '#E0E3E7',
        borderRadius: 20
    },
    contactless: {
        width: 28,
        height: 28,
        marginRight: 1
    },
    cardName: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 20,
        color: colors.gray_900,
        marginTop: 5
    },
    sage: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 20,
        color: colors.gray_900,
        lineHeight: 20,
        marginBottom: 5
    },
    chipcard: {
        width: 40,
        height: 29
    },
    containerChip: {
        marginLeft: 10,
    },
    containerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerBottom: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    input: {
        backgroundColor: colors.gray_800,
        borderRadius: 12,
        height: 50,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    inputText: {
        fontFamily: 'Outfit_500Medium',
        color: colors.white,
        fontSize: 15,
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '30%',
        bottom: 0,
        zIndex: -1,
        opacity: 0.4,
    },
    sliderContainer: {
        marginTop: 30
    },
    buttonContainer: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15
    },
    button: {
        width: 160,
        height: 45,
        justifyContent: 'center',
        borderRadius: 13
    },
    btnCardRegister: {
        backgroundColor: colors.blue_600
    },
    btnCancel: {
        backgroundColor: colors.orange_300
    },
    btnText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 18,
        color: colors.gray_50,
        textAlign: 'center',
        height: 22
    }
})
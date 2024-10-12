import React, { useRef, useState } from 'react';
import { Dimensions, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Input from '~/components/Input';
import { Dropdown } from 'react-native-element-dropdown';
import Overlay from '~/components/Overlay';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import base from '~/css/base';
import { FontAwesome6 } from '@expo/vector-icons';
import colors from '~/css/colors';

const { width, height } = Dimensions.get('window');

type CardDatailsScreenNavigationProp = StackNavigationProp<any, 'CardDatails'>;

export default function CardDatails() {
    const navigation = useNavigation<CardDatailsScreenNavigationProp>();
    const [cardName, setCardName] = useState("Cartão 1"); // TODO: Trazer nome do cartão do banco de dados
    const [limit, setLimit] = useState<number>();
    const [closingDay, setClosingDay] = useState<{ label: string; value: number }>({ label: '1', value: 1 });
    const [expirationDay, setExpirationDay] = useState<{ label: string; value: number }>({ label: '5', value: 5 });
    const [overlay, setOverley] = useState(false);
    const closingRef = useRef<any>(null);
    const expirationRef = useRef<any>(null);

    const days = Array.from({ length: 31 }, (_, index) => ({
        label: `${index + 1}`,
        value: index + 1,
    }));

    const handleNavigateToBack = () => {
        navigation.goBack();
    };

    // formatar valor do input
    const formatValueInput = (value: any) => {
        if (!value) return;

        const parsedValue = parseFloat(value.toString().replace(/[^0-9]/g, ''));
        return `R$ ${!isNaN(parsedValue) ? parsedValue.toLocaleString('pt-BR') : ''}`;
    };

    const renderItem = (item: { label: string; value: number }) => {
        return (
            <View style={[styles.dayOption]}>
                <Text style={styles.itemText}>{item.label}</Text>
            </View>
        );
    };

    const expandClosingDropdown = () => {
        closingRef.current?.open();
    };

    const expandExpirationDropdown = () => {
        expirationRef.current?.open();
    };

    return (
        <View style={[styles.container, base.flex_1]}>
            <View style={[base.px_30, base.alignItemsCenter]}>
                {/* Seta para voltar */}
                <View style={[styles.containerBack]}>
                    {/* <TouchableOpacity onPress={handleNavigateToBack}>
                        <FontAwesome6 name="angle-left" size={20} color={colors.gray_50} />
                    </TouchableOpacity> */}
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
                <View style={[base.mt_30, base.gap_15, base.w_100]}>
                    <Input 
                        style={styles.input}
                        placeholder="Nome do cartão"
                        placeholderTextColor="#F8F1F1"
                        onChangeText={(name: string) => setCardName(name)}
                        value={cardName}
                        maxLength={25}
                        overlay={(value: boolean) => setOverley(value)}
                    />
                    <Input
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Limite do cartão"
                        placeholderTextColor="#F8F1F1"
                        onChangeText={(limit: number) => setLimit(limit)}
                        value={formatValueInput(limit)}
                        maxLength={14}
                        overlay={(value: boolean) => setOverley(value)}
                    />
                    <TouchableOpacity style={styles.dropdown} activeOpacity={1} onPress={expandClosingDropdown}>
                        <Text style={[styles.inputText]}>Dia do fechamento</Text>
                        <Dropdown
                            ref={closingRef}
                            style={[base.h_100, {width: 50}]}
                            selectedTextStyle={styles.selectedTextStyle}
                            placeholderStyle={styles.placeholderStyle}
                            containerStyle={styles.dropdownContainer}
                            showsVerticalScrollIndicator={false}
                            maxHeight={190}
                            value={closingDay}
                            data={days}
                            valueField="value"
                            labelField="label"
                            placeholder={''}
                            onChange={item => setClosingDay(item)}
                            renderRightIcon={() => (
                                <FontAwesome6
                                    name="calendar-day"
                                    color={colors.gray_100}
                                    size={20}
                                />
                            )}
                            renderItem={renderItem}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropdown} activeOpacity={1} onPress={expandExpirationDropdown}>
                        <Text style={[styles.inputText]}>Dia do vencimento</Text>
                        <Dropdown
                            ref={expirationRef}
                            style={[base.h_100, { width: 50 }]}
                            selectedTextStyle={styles.selectedTextStyle}
                            placeholderStyle={styles.placeholderStyle}
                            containerStyle={styles.dropdownContainer}
                            showsVerticalScrollIndicator={false}
                            maxHeight={190}
                            value={expirationDay}
                            data={days}
                            valueField="value"
                            labelField="label"
                            placeholder={''}
                            onChange={item => setExpirationDay(item)}
                            renderRightIcon={() => (
                                <FontAwesome6
                                    name="calendar-check"
                                    color={colors.gray_100}
                                    size={20}
                                />
                            )}
                            renderItem={renderItem}
                        />
                    </TouchableOpacity>
                </View>
                {/* Botões */}
                <View style={[styles.buttonContainer]}>
                    <TouchableOpacity style={[base.button, base.btnCancel]} onPress={handleNavigateToBack}>
                        <Text style={[base.btnText]}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[base.button, base.btnSave]}>
                        <Text style={[base.btnText]}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* <Image
                source={require('../assets/images/imgFooter.png')}
                style={styles.backgroundImage}
            /> */}
            {overlay && <Overlay style={[styles.overlay]} />}
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
        justifyContent: 'flex-start',
        width: '100%',
        marginTop: 30,
        marginBottom: 25,
    },
    title: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.gray_50,
        fontSize: 20,
        lineHeight: 24
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
        justifyContent: 'space-between',
        fontFamily: 'Outfit_500Medium',
        color: colors.white,
        fontSize: 15,
    },
    inputText: {
        fontFamily: 'Outfit_500Medium',
        color: colors.white,
        fontSize: 15,
    },
    inputTextSlider: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 16,
        color: colors.white,
        width: 80,
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '30%',
        bottom: 0,
        zIndex: -1,
        opacity: 0.4,
    },
    buttonContainer: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15
    },
    overlay: {
        width,
        height
    },
    dropdown: {
        height: 50,
        borderColor: colors.gray_800,
        backgroundColor: colors.gray_800,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 20,
        color: colors.gray_100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dropdownContainer: {
        borderWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: colors.gray_800
    },
    placeholderStyle: {
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_100,
        fontSize: 16,
    },
    selectedTextStyle: {
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_100,
        fontSize: 16,
    },
    itemText: {
        color: colors.gray_100,
        fontSize: 16,
        textAlign: 'center'
    },
    dayOption: {
        padding: 12,
        backgroundColor: colors.gray_800,
    },
})
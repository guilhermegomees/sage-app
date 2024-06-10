import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialIcons, colors } from '~/imports';

const generateDaysArray = (): number[] => {
    return Array.from({ length: 31 }, (_, i) => i + 1);
};

const DayPicker: React.FC = () => {
    const [day, setDay] = useState<number | any>(null);
    const [isFocus, setIsFocus] = useState<boolean>(false);
    
    const days = generateDaysArray().map(day => ({ label: day.toString(), value: day }));

    const renderItem = (item: { label: string; value: number }) => {
        return (
            <View style={[styles.dayOption, item.value === day && styles.selectedItem]}>
                <Text style={styles.itemText}>{item.label}</Text>
            </View>
        );
    };

    return (
        <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: colors.white_300 }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            containerStyle={styles.dropdownContainer}
            data={days}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Dia do vencimento' : '...'}
            value={day}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
                setDay(item.value);
                setIsFocus(false);
            }}
            renderRightIcon={() => (
                <MaterialIcons
                    name="calendar-month"
                    color={colors.white_200}
                    size={20} 
                />
            )}
            renderItem={renderItem}
        />
    );
};

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderColor: colors.gray_800,
        backgroundColor: colors.gray_800,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 18,
        marginBottom: 10,
        color: colors.white_200
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    dropdownContainer: {
        borderWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        borderRadius: 12,
        overflow: 'hidden',
    },
    placeholderStyle: {
        fontFamily: 'Outfit_500Medium',
        color: colors.white_200,
        fontSize: 16,
    },
    selectedTextStyle: {
        fontFamily: 'Outfit_500Medium',
        color: colors.white_200,
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    itemText: {
        color: colors.white_200,
        fontSize: 16,
    },
    dayOption: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        backgroundColor: colors.gray_800
    },
    selectedItem: {
        backgroundColor: colors.gray_400,
    },
});

// const styles = StyleSheet.create({
//     pickerContainer: {
//         backgroundColor: colors.gray_800,
//         borderRadius: 15,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         height: 50,
//         paddingHorizontal: 18
//     },
//     selectedDayText: {
//         fontFamily: 'Outfit_400Regular',
//         color: colors.white,
//         fontSize: 15
//     },
//     picker: {
//         backgroundColor: colors.gray_800,
//         borderRadius: 15,
//         paddingVertical: 5,
//         alignItems: 'center',
//         width: '100%',
//         maxHeight: 200,
//     },
// })

export default DayPicker;
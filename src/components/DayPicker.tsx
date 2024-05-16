import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    MaterialIcons,
    colors,
    base
} from '~/imports';

const DayPicker: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState('1');
    const [isPickerVisible, setPickerVisible] = useState(false);

    const togglePicker = () => {
        setPickerVisible(!isPickerVisible);
    };

    const handleDayChange = (day: string) => {
        setSelectedDay(day);
        togglePicker();
    };

    return (
        <>
            <TouchableOpacity style={styles.pickerContainer} onPress={togglePicker}>
                <Text style={styles.selectedDayText}>{selectedDay}</Text>
                <MaterialIcons name="calendar-month" size={20} color="white" />
            </TouchableOpacity>
            {isPickerVisible && (
                <View style={styles.picker}>
                    <ScrollView style={[base.w_100]} showsVerticalScrollIndicator={false}>
                        {Array.from({ length: 31 }, (_, i) => (
                            <TouchableOpacity key={i + 1} style={[styles.dayOption]} onPress={() => handleDayChange(`${i + 1}`)}>
                                <Text style={[{ color: colors.white }]}>{i + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    pickerContainer: {
        backgroundColor: colors.gray_800,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: 18
    },
    selectedDayText: {
        fontFamily: 'Outfit_400Regular',
        color: colors.white,
        fontSize: 15
    },
    picker: {
        backgroundColor: colors.gray_800,
        borderRadius: 15,
        paddingVertical: 5,
        alignItems: 'center',
        maxHeight: 200,
    },
    dayOption: {
        width: '100%',
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default DayPicker;
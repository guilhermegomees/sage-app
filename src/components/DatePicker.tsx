import React, { useState } from 'react';
import { 
    View,
    Platform,
    TextInput,
    colors,
    StyleSheet,
    MaterialIcons,
    TouchableWithoutFeedback
} from '~/imports';

import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
    initialDate?: Date;
};

const DatePickerComponent: React.FC<Props> = ({ initialDate = new Date() }) => {
    const [date, setDate] = useState<Date>(initialDate);
    const [show, setShow] = useState<boolean>(false);

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const formatDate = (date: Date): string => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return `${day > 9 ? day : '0' + day}/${month > 9 ? month : '0' + month}/${year}`;
    };

    return (
        <View>
            <TouchableWithoutFeedback onPress={() => setShow(true)}>
                <View style={[styles.input]}>
                    <MaterialIcons name="calendar-month" size={20} color="white" />
                    <TextInput 
                        style={styles.inputText}
                        placeholder="Vencimento"
                        placeholderTextColor="#F8F1F1"
                        value={formatDate(date)}
                        editable={false}
                    />
                </View>
            </TouchableWithoutFeedback>
            {show && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                    onTouchCancel={() => setShow(false)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: colors.gray_800,
        borderRadius: 15,
        height: 50,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    inputText: {
        fontFamily: 'Outfit_400Regular',
        color: colors.white,
        fontSize: 15,
    },
})

export default DatePickerComponent;
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { LocaleConfig, Calendar as ReactNativeCalendars } from "react-native-calendars";
import { MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import base from "~/css/base";
import colors from "~/css/colors";

LocaleConfig.locales['pt-BR'] = {
    monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-BR';

interface CalendarModalProps {
    isVisible: boolean;
    selectedTempDate: string;
    handleSelectTempDate: (date: string) => void;
    handleSelectDate: () => void;
    handleCancelCalendar: () => void;
}

export const Calendar: React.FC<CalendarModalProps> = ({
    isVisible,
    selectedTempDate,
    handleSelectTempDate,
    handleSelectDate,
    handleCancelCalendar,
}) => (
    <Modal
        isVisible={isVisible}
        onBackdropPress={handleCancelCalendar}
        backdropOpacity={0.4}
        style={[base.alignItemsCenter, base.px_10]}
    >
        <View style={styles.calendarContainer}>
            <ReactNativeCalendars
                initialDate={selectedTempDate}
                onDayPress={(day: any) => handleSelectTempDate(day.dateString)}
                markedDates={{ [selectedTempDate]: { selected: true, selectedColor: colors.blue_300 } }}
                style={styles.calendar}
                hideExtraDays={true}
                theme={calendarTheme}
                renderArrow={(direction: string) => (
                    <MaterialIcons
                        name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
                        size={24}
                        color={colors.blue_300}
                    />
                )}
            />
            <View style={[base.flexRow, base.justifyContentSpaceBetween, base.px_15, base.mt_20]}>
                <TouchableOpacity onPress={handleCancelCalendar}>
                    <Text style={[styles.calendarText, {color: colors.orange_300}]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSelectDate}>
                    <Text style={styles.calendarText}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

const calendarTheme = {
    calendarBackground: colors.gray_800,
    textSectionTitleColor: colors.gray_500,
    todayTextColor: colors.blue_300,
    dayTextColor: colors.gray_100,
    dotColor: colors.blue_300,
    arrowColor: colors.blue_300,
    monthTextColor: colors.blue_300,
    indicatorColor: colors.blue_300,
    textDayFontFamily: 'Outfit_600SemiBold',
    textMonthFontFamily: 'Outfit_600SemiBold',
    textDayHeaderFontFamily: 'Outfit_600SemiBold',
    selectedDayTextColor: 'black',
    'stylesheet.day': {
        base: { margin: 1 },
        text: { borderRadius: 10 },
    },
};

const styles = StyleSheet.create({
    calendarContainer: {
        width: "100%",
        padding: 15,
        paddingBottom: 25,
        backgroundColor: colors.gray_800,
        borderRadius: 15,
    },
    calendar: {
        backgroundColor: colors.gray_800,
        borderRadius: 15,
    },
    calendarText: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: colors.blue_300,
    },
});
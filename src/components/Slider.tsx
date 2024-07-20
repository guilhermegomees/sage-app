import React, { useEffect, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { Slider } from 'react-native-awesome-slider';
import {
    View,
    StyleSheet,
    TextInput,
    colors,
    base,
} from '~/imports';

const SliderComponent: React.FC = () => {
    const [sliderValue, setSliderValue] = useState<number>(3000); // TODO: Valor do limite deve vir do banco de dados
    const progressSlider = useSharedValue(sliderValue);
    const minSlider = useSharedValue(0);
    const maxSlider = useSharedValue(10000); 
    const maxInput = useSharedValue(999999);

    // formatar texto da bolha do slider
    const formatBubble = (value: number) => {
        return Math.floor(value).toString();
    };

    // formatar valor do input
    const formatValueInput = (value: number): string => {
        return `R$ ${value.toFixed(0)}`;
    };

    // atualizar o valor do progresso com o valor atual do slider
    useEffect(() => {
        progressSlider.value = sliderValue;
    }, [sliderValue]);

    // atualizar valor do slider
    const onValueChange = (newValue: number) => {
        setSliderValue(newValue);
    };

    const onInputChange = (text: string) => {
        const parsedValue = parseFloat(text.replace(/[^0-9]/g, ''));
        if (isNaN(parsedValue) || parsedValue < minSlider.value || parsedValue > maxInput.value) {
            return;
        }
        if (text === null) {
            setSliderValue(0);
        } else {
            setSliderValue(parsedValue);
        }
    };

    return (
        <View style={[styles.containerSlider]}>
            <Slider
                progress={progressSlider}
                minimumValue={minSlider}
                maximumValue={maxSlider}
                bubble={formatBubble}
                onValueChange={onValueChange}
                theme={{
                    maximumTrackTintColor: colors.gray_400,
                    minimumTrackTintColor: colors.blue_600,
                    bubbleBackgroundColor: colors.blue_600
                }}
            />
            <TextInput
                style={[styles.textInput]}
                keyboardType="numeric"
                value={formatValueInput(sliderValue)}
                onChangeText={onInputChange}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    containerSlider: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        gap: 20,
    },
    textInput: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 16,
        color: colors.white,
        width: 80,
        height: 40,
    }
})

export default SliderComponent;
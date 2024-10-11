import { FontAwesome6, Ionicons, Octicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import colors from "~/css/colors";
import { transactionContext as context } from "~/enums/enums";
import NewTransaction from "~/screens/NewTransaction";

const FloatingButton: React.FC = () => {
    const [isTransactionModalVisible, setTransactionModalVisible] = useState<boolean>(false);
    const [transactionContext, setTransactionContext] = useState<context>(context.revenue);
    const [icon_1] = useState<Animated.Value>(new Animated.Value(40));
    const [icon_2] = useState<Animated.Value>(new Animated.Value(40));
    const [icon_3] = useState<Animated.Value>(new Animated.Value(40));

    const [pop, setPop] = useState<boolean>(false);

    const popIn = () => {
        setPop(true);
        Animated.timing(icon_1, {
            toValue: 130,
            duration: 200,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_2, {
            toValue: 110,
            duration: 200,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_3, {
            toValue: 130,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }

    const popOut = () => {
        setPop(false);
        Animated.timing(icon_1, {
            toValue: 40,
            duration: 200,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_2, {
            toValue: 40,
            duration: 200,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_3, {
            toValue: 40,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }

    const toggleModal = (context: context) => {
        popOut();
        setTransactionContext(context);
        setTransactionModalVisible(!isTransactionModalVisible);
    }

    return (
        <>
            <View style={[styles.fabButton]}>
                <Animated.View style={[styles.circle, styles.insideCircles, { bottom: icon_1 }]}>
                    <TouchableOpacity onPress={() => { toggleModal(context.revenue) }}>
                        <FontAwesome6 name={"arrow-trend-up"} size={22} color={colors.green_500} />
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={[styles.circle, styles.insideCircles, { bottom: icon_2, right: icon_2 }]}>
                    <TouchableOpacity onPress={() => { toggleModal(context.expense) }}>
                        <FontAwesome6 name={"arrow-trend-down"} size={22} color={colors.red_500} />
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={[styles.circle, styles.insideCircles, { right: icon_3 }]}>
                    <TouchableOpacity onPress={() => { toggleModal(context.cardExpense) }}>
                        <FontAwesome6 name={"credit-card"} size={22} color={colors.white} />
                    </TouchableOpacity>
                </Animated.View>
                <TouchableOpacity
                    style={[styles.circle, { backgroundColor: colors.gray_700 }]}
                    activeOpacity={0.8}
                    onPress={() => {
                        pop === false ? popIn() : popOut();
                    }}
                >
                    <FontAwesome6 name="plus" size={22} color={colors.white} />
                </TouchableOpacity>
            </View>
            <NewTransaction
                isModalVisible={isTransactionModalVisible}
                context={transactionContext}
                onClose={() => { setTransactionModalVisible(!isTransactionModalVisible) }}
            />
        </>
    );
}

export default FloatingButton;

const styles = StyleSheet.create({
    circle: {
        width: 60,
        height: 60,
        position: 'absolute',
        bottom: 40,
        right: 40,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    insideCircles: {
        backgroundColor: colors.gray_700
    },
    fabButton: {
        position: 'absolute',
        bottom: 40,
        right: -30
    },
});
import { FontAwesome6, Octicons } from "@expo/vector-icons";
import { ScrollView, TextInput, TouchableOpacity, View, Text, Image, StyleSheet, ImageSourcePropType } from "react-native";
import Modal from "react-native-modal";
import base from "~/css/base";
import colors from "~/css/colors";
import SearchBar from "./SearchBar";

interface SelectionModalProps<T> {
    isVisible: boolean;
    filteredItems: T[];
    searchItem: string;
    setSearchItem: (text: string) => void;
    handleSelectItem: (item: T) => void;
    handleNewItem?: () => void;
    setIsVisible: (visible: boolean) => void;
    selectedItem: T | null;
    contextLabel: string;
    getItemIcon: (item: T) => string | ImageSourcePropType; // Agora aceita tanto string quanto imagem
    getItemColor?: (item: T) => string; // O item de cor é opcional
    getItemName: (item: T) => string;
    placeholder?: string;
}

export const SelectionModal = <T extends { id: string }>({
    isVisible,
    filteredItems,
    searchItem,
    setSearchItem,
    handleSelectItem,
    handleNewItem,
    setIsVisible,
    selectedItem,
    contextLabel,
    getItemIcon,
    getItemColor,
    getItemName,
    placeholder,
}: SelectionModalProps<T>) => (
    <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        backdropOpacity={0.4}
        style={[base.justifyContentEnd, base.m_0]}
    >
        <View style={[styles.container]}>
            <View style={[base.px_20]}>
                <SearchBar searchItem={searchItem} setSearchItem={setSearchItem} placeholder={placeholder} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {filteredItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    const itemColor = getItemColor ? getItemColor(item) : colors.gray_600; // Cor padrão
                    const itemIcon = getItemIcon(item);

                    return (
                        <TouchableOpacity key={item.id} style={[base.px_20]} onPress={() => handleSelectItem(item)}>
                            <View style={[base.flexRow, base.justifyContentSpaceBetween, base.alignItemsCenter, base.w_100, base.py_18]}>
                                <View style={[base.flexRow, base.alignItemsCenter, base.gap_15]}>
                                    {typeof itemIcon === 'string' ? (
                                        <View style={[styles.iconContainer, { backgroundColor: itemColor }]}>
                                            <FontAwesome6 name={itemIcon} color={colors.white} size={15} />
                                        </View>
                                    ) : (
                                        <Image source={itemIcon} style={{ width: 40, height: 40, borderRadius: 50 }} />
                                    )}
                                    <Text style={[styles.name]}>{getItemName(item)}</Text>
                                </View>
                                <Octicons
                                    name={isSelected ? "check-circle-fill" : "circle"}
                                    size={20}
                                    color={isSelected ? colors.blue_300 : colors.gray_600}
                                />
                            </View>
                            <View style={[styles.lineBottom]} />
                        </TouchableOpacity>
                    );
                })}
                {filteredItems.length === 0 && (
                    <View style={[base.justifyContentCenter, base.alignItemsCenter, base.flex_1, base.pt_25, base.pb_10, base.px_25]}>
                        <View style={[base.justifyContentCenter, base.alignItemsCenter, base.gap_15]}>
                            <Image source={require('./../assets/images/empty-folder.png')} tintColor={colors.gray_100} style={{ width: 65, height: 65 }} />
                            <Text style={base.emptyMessage}>
                                Você ainda não tem {contextLabel}. Comece criando uma em "Criar nova {contextLabel}".
                            </Text>
                        </View>
                    </View>
                )}
                <TouchableOpacity style={[base.px_20, base.pb_10]} onPress={handleNewItem}>
                    <View style={[base.flexRow, base.alignItemsCenter, base.gap_15, base.py_18]}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.gray_600 }]}>
                            <FontAwesome6 name="plus" color={colors.white} size={15} />
                        </View>
                        <Text style={[styles.textCreate]}>Criar nova {contextLabel}</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_875,
        height: '80%',
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    iconContainer: {
        borderRadius: 50,
        padding: 10,
        width: 38,
        height: 38,
        justifyContent: "center",
        alignItems: "center"
    },
    searchBar: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 15,
        color: colors.gray_200
    },
    name: {
        color: colors.gray_100,
        fontSize: 15,
        fontFamily: 'Outfit_500Medium',
        lineHeight: 18
    },
    textCreate: {
        color: colors.gray_200,
        fontSize: 15,
        fontFamily: 'Outfit_500Medium'
    },
    lineBottom: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray_700
    },
});
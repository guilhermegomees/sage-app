import { View, StyleSheet } from "react-native";

const Overlay: React.FC<any> = (props) => {
    return (
        <View style={[props.style, styles.overlay]} />
    )
}

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute'
    },
})

export default Overlay;
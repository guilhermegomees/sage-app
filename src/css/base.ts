import { StyleSheet } from 'react-native';
import colors from './colors';
import { ClipPath } from 'react-native-svg';

export const base = StyleSheet.create({
	input: {
        backgroundColor: colors.gray_900,
        borderRadius: 15,
        height: 50,
		width: '100%',
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Outfit_500Medium',
        color: colors.white,
        fontSize: 15,
    },
    inputText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 15,
		color: colors.white,
		lineHeight: 18,
    },
	inputDescript: {
		backgroundColor: colors.gray_825,
		borderRadius: 12,
		textAlignVertical: 'top',
		padding: 15,
		fontFamily: 'Outfit_500Medium',
		color: colors.white,
		fontSize: 15,
		height: 75,
	},
	button: {
		width: 160,
        height: 45,
        justifyContent: 'center',
        borderRadius: 13,
		backgroundColor: colors.blue_600
	},
	btnText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 18,
        color: colors.gray_50,
        textAlign: 'center',
        height: 22
    },
	btnCancel: {
        backgroundColor: colors.orange_300
    },
	btnSave: {
        backgroundColor: colors.blue_600
    },
	emptyMessage: {
		fontFamily: 'Outfit_500Medium',
		textAlign: 'center',
		color: colors.gray_50,
		fontSize: 15,
	},

	// Widths
	w_0: {
		width: '0%',
	},
	w_10: {
		width: '10%',
	},
	w_20: {
		width: '20%',
	},
	w_30: {
		width: '30%',
	},
	w_40: {
		width: '40%',
	},
	w_50: {
		width: '50%',
	},
	w_60: {
		width: '60%',
	},
	w_70: {
		width: '70%',
	},
	w_80: {
		width: '80%',
	},
	w_90: {
		width: '90%',
	},
	w_100: {
		width: '100%',
	},

	// Heights
	h_0: {
		height: '0%',
	},
	h_10: {
		height: '10%',
	},
	h_20: {
		height: '20%',
	},
	h_30: {
		height: '30%',
	},
	h_40: {
		height: '40%',
	},
	h_50: {
		height: '50%',
	},
	h_60: {
		height: '60%',
	},
	h_70: {
		height: '70%',
	},
	h_80: {
		height: '80%',
	},
	h_90: {
		height: '90%',
	},
	h_100: {
		height: '100%',
	},

	// Margins
	m_0: {
		margin: 0,
	},
	m_5: {
		margin: 5,
	},
	m_10: {
		margin: 10,
	},
	m_15: {
		margin: 15,
	},
	m_20: {
		margin: 20,
	},
	m_25: {
		margin: 25,
	},
	m_30: {
		margin: 30,
	},
	m_35: {
		margin: 35,
	},
	m_40: {
		margin: 40,
	},
	m_45: {
		margin: 45,
	},
	m_50: {
		margin: 50,
	},

	// Margins Top
	mt_0: {
		marginTop: 0,
	},
	mt_5: {
		marginTop: 5,
	},
	mt_10: {
		marginTop: 10,
	},
	mt_15: {
		marginTop: 15,
	},
	mt_20: {
		marginTop: 20,
	},
	mt_25: {
		marginTop: 25,
	},
	mt_30: {
		marginTop: 30,
	},
	mt_35: {
		marginTop: 35,
	},
	mt_40: {
		marginTop: 40,
	},
	mt_45: {
		marginTop: 45,
	},
	mt_50: {
		marginTop: 50,
	},
	mt_55: {
		marginTop: 55,
	},
	mt_60: {
		marginTop: 60,
	},
	mt_65: {
		marginTop: 65,
	},
	mt_70: {
		marginTop: 70,
	},

	// Margins Left
	ms_0: {
		marginLeft: 0,
	},
	ms_5: {
		marginLeft: 5,
	},
	ms_10: {
		marginLeft: 10,
	},
	ms_15: {
		marginLeft: 15,
	},
	ms_20: {
		marginLeft: 20,
	},
	ms_25: {
		marginLeft: 25,
	},
	ms_30: {
		marginLeft: 30,
	},
	ms_35: {
		marginLeft: 35,
	},
	ms_40: {
		marginLeft: 40,
	},
	ms_45: {
		marginLeft: 45,
	},
	ms_50: {
		marginLeft: 50,
	},

	// Margins Right
	me_0: {
		marginRight: 0,
	},
	me_5: {
		marginRight: 5,
	},
	me_10: {
		marginRight: 10,
	},
	me_15: {
		marginRight: 15,
	},
	me_20: {
		marginRight: 20,
	},
	me_25: {
		marginRight: 25,
	},
	me_30: {
		marginRight: 30,
	},
	me_35: {
		marginRight: 35,
	},
	me_40: {
		marginRight: 40,
	},
	me_45: {
		marginRight: 45,
	},
	me_50: {
		marginRight: 50,
	},

	// Margins Bottom
	mb_0: {
		marginBottom: 0,
	},
	mb_5: {
		marginBottom: 5,
	},
	mb_10: {
		marginBottom: 10,
	},
	mb_15: {
		marginBottom: 15,
	},
	mb_20: {
		marginBottom: 20,
	},
	mb_25: {
		marginBottom: 25,
	},
	mb_30: {
		marginBottom: 30,
	},
	mb_35: {
		marginBottom: 35,
	},
	mb_40: {
		marginBottom: 40,
	},
	mb_45: {
		marginBottom: 45,
	},
	mb_50: {
		marginBottom: 50,
	},

	// Margens Verticais
	my_0: {
		marginVertical: 0,
	},
	my_5: {
		marginVertical: 5,
	},
	my_10: {
		marginVertical: 10,
	},
	my_15: {
		marginVertical: 15,
	},
	my_20: {
		marginVertical: 20,
	},
	my_25: {
		marginVertical: 25,
	},
	my_30: {
		marginVertical: 30,
	},
	my_35: {
		marginVertical: 35,
	},
	my_40: {
		marginVertical: 40,
	},
	my_45: {
		marginVertical: 45,
	},
	my_50: {
		marginVertical: 50,
	},

	// Margens Horizontais
	mx_0: {
		marginHorizontal: 0,
	},
	mx_2: {
		marginHorizontal: 2,
	},
	mx_5: {
		marginHorizontal: 5,
	},
	mx_10: {
		marginHorizontal: 10,
	},
	mx_15: {
		marginHorizontal: 15,
	},
	mx_20: {
		marginHorizontal: 20,
	},
	mx_25: {
		marginHorizontal: 25,
	},
	mx_30: {
		marginHorizontal: 30,
	},
	mx_35: {
		marginHorizontal: 35,
	},
	mx_40: {
		marginHorizontal: 40,
	},
	mx_45: {
		marginHorizontal: 45,
	},
	mx_50: {
		marginHorizontal: 50,
	},

	// Paddings
	p_0: {
		padding: 0,
	},
	p_5: {
		padding: 5,
	},
	p_10: {
		padding: 10,
	},
	p_13: {
		padding: 13,
	},
	p_15: {
		padding: 15,
	},
	p_20: {
		padding: 20,
	},
	p_25: {
		padding: 25,
	},
	p_30: {
		padding: 30,
	},
	p_35: {
		padding: 35,
	},
	p_40: {
		padding: 40,
	},
	p_45: {
		padding: 45,
	},
	p_50: {
		padding: 50,
	},

	// Paddings Left
	ps_0: {
		paddingLeft: 0,
	},
	ps_5: {
		paddingLeft: 5,
	},
	ps_10: {
		paddingLeft: 10,
	},
	ps_15: {
		paddingLeft: 15,
	},
	ps_20: {
		paddingLeft: 20,
	},
	ps_25: {
		paddingLeft: 25,
	},
	ps_30: {
		paddingLeft: 30,
	},
	ps_35: {
		paddingLeft: 35,
	},
	ps_40: {
		paddingLeft: 40,
	},
	ps_45: {
		paddingLeft: 45,
	},
	ps_50: {
		paddingLeft: 50,
	},

	// Paddings Right
	pe_0: {
		paddingRight: 0,
	},
	pe_5: {
		paddingRight: 5,
	},
	pe_10: {
		paddingRight: 10,
	},
	pe_15: {
		paddingRight: 15,
	},
	pe_20: {
		paddingRight: 20,
	},
	pe_25: {
		paddingRight: 25,
	},
	pe_30: {
		paddingRight: 30,
	},
	pe_35: {
		paddingRight: 35,
	},
	pe_40: {
		paddingRight: 40,
	},
	pe_45: {
		paddingRight: 45,
	},
	pe_50: {
		paddingRight: 50,
	},

	// Paddings Top
	pt_0: {
		paddingTop: 0,
	},
	pt_5: {
		paddingTop: 5,
	},
	pt_10: {
		paddingTop: 10,
	},
	pt_15: {
		paddingTop: 15,
	},
	pt_20: {
		paddingTop: 20,
	},
	pt_25: {
		paddingTop: 25,
	},
	pt_30: {
		paddingTop: 30,
	},
	pt_35: {
		paddingTop: 35,
	},
	pt_40: {
		paddingTop: 40,
	},
	pt_45: {
		paddingTop: 45,
	},
	pt_50: {
		paddingTop: 50,
	},

	// Paddings Bottom
	pb_0: {
		paddingBottom: 0,
	},
	pb_5: {
		paddingBottom: 5,
	},
	pb_10: {
		paddingBottom: 10,
	},
	pb_15: {
		paddingBottom: 15,
	},
	pb_20: {
		paddingBottom: 20,
	},
	pb_25: {
		paddingBottom: 25,
	},
	pb_30: {
		paddingBottom: 30,
	},
	pb_35: {
		paddingBottom: 35,
	},
	pb_40: {
		paddingBottom: 40,
	},
	pb_45: {
		paddingBottom: 45,
	},
	pb_50: {
		paddingBottom: 50,
	},
	pb_60: {
		paddingBottom: 60,
	},

	// Paddings Verticais
	py_0: {
		paddingVertical: 0,
	},
	py_5: {
		paddingVertical: 5,
	},
	py_10: {
		paddingVertical: 10,
	},
	py_15: {
		paddingVertical: 15,
	},
	py_18: {
		paddingVertical: 18,
	},
	py_20: {
		paddingVertical: 20,
	},
	py_25: {
		paddingVertical: 25,
	},
	py_30: {
		paddingVertical: 30,
	},
	py_35: {
		paddingVertical: 35,
	},
	py_40: {
		paddingVertical: 40,
	},
	py_45: {
		paddingVertical: 45,
	},
	py_50: {
		paddingVertical: 50,
	},

	// Paddings Horizontais
	px_0: {
		paddingHorizontal: 0,
	},
	px_5: {
		paddingHorizontal: 5,
	},
	px_10: {
		paddingHorizontal: 10,
	},
	px_15: {
		paddingHorizontal: 15,
	},
	px_20: {
		paddingHorizontal: 20,
	},
	px_25: {
		paddingHorizontal: 25,
	},
	px_30: {
		paddingHorizontal: 30,
	},
	px_35: {
		paddingHorizontal: 35,
	},
	px_40: {
		paddingHorizontal: 40,
	},
	px_45: {
		paddingHorizontal: 45,
	},
	px_50: {
		paddingHorizontal: 50,
	},
	px_65: {
		paddingHorizontal: 65,
	},

	// Displays
	dflex: {
		display: 'flex',
	},
	justifyContentCenter: {
		justifyContent: 'center',
	},
	justifyContentStart: {
		justifyContent: 'flex-start',
	},
	justifyContentEnd: {
		justifyContent: 'flex-end',
	},
	justifyContentSpaceBetween: {
		justifyContent: 'space-between',
	},
	alignItemsCenter: {
		alignItems: 'center',
	},
	alignItemsStart: {
		alignItems: 'flex-start',
	},
	alignItemsEnd: {
		alignItems: 'flex-end',
	},
	flexRow: {
		flexDirection: 'row',
	},
	flexRowReverse: {
		flexDirection: 'row-reverse',
	},
	flexColumn: {
		flexDirection: 'column',
	},
	flexCenter: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	flexStart: {
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	flexEnd: {
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
	},
	flexSpaceBetween: {
		justifyContent: 'space-between',
	},
	flexSpaceAround: {
		justifyContent: 'space-around',
	},
	flexSpaceEvenly: {
		justifyContent: 'space-evenly',
	},
	flexAlignStart: {
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	flexAlignEnd: {
		justifyContent: 'center',
		alignItems: 'flex-end',
	},
	flexAlignCenter: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	flexJustifyStart: {
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	flexJustifyEnd: {
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	flexJustifyCenter: {
		justifyContent: 'center',
		alignItems: 'center',
	},

	// Gaps
	gap_1: {
		gap: 1
	},
	gap_2: {
		gap: 2
	},
	gap_3: {
		gap: 3
	},
	gap_4: {
		gap: 4
	},
	gap_5: {
		gap: 5
	},
	gap_6: {
		gap: 6
	},
	gap_7: {
		gap: 7
	},
	gap_8: {
		gap: 8
	},
	gap_9: {
		gap: 9
	},
	gap_10: {
		gap: 10
	},
	gap_11: {
		gap: 11
	},
	gap_12: {
		gap: 12
	},
	gap_13: {
		gap: 13
	},
	gap_14: {
		gap: 14
	},
	gap_15: {
		gap: 15
	},
	gap_16: {
		gap: 16
	},
	gap_17: {
		gap: 17
	},
	gap_18: {
		gap: 18
	},
	gap_19: {
		gap: 19
	},
	gap_20: {
		gap: 20
	},
	gap_21: {
		gap: 21
	},
	gap_22: {
		gap: 22
	},
	gap_23: {
		gap: 23
	},
	gap_24: {
		gap: 24
	},
	gap_25: {
		gap: 25
	},
	gap_26: {
		gap: 26
	},
	gap_27: {
		gap: 27
	},
	gap_28: {
		gap: 28
	},
	gap_29: {
		gap: 29
	},
	gap_30: {
		gap: 30
	},
	gap_31: {
		gap: 31
	},
	gap_32: {
		gap: 32
	},
	gap_33: {
		gap: 33
	},
	gap_34: {
		gap: 34
	},
	gap_35: {
		gap: 35
	},
	gap_36: {
		gap: 36
	},
	gap_37: {
		gap: 37
	},
	gap_38: {
		gap: 38
	},
	gap_39: {
		gap: 39
	},
	gap_40: {
		gap: 40
	},
	gap_41: {
		gap: 41
	},
	gap_42: {
		gap: 42
	},
	gap_43: {
		gap: 43
	},
	gap_44: {
		gap: 44
	},
	gap_45: {
		gap: 45
	},
	gap_46: {
		gap: 46
	},
	gap_47: {
		gap: 47
	},
	gap_48: {
		gap: 48
	},
	gap_49: {
		gap: 49
	},
	gap_50: {
		gap: 50
	},

	// Flex
	flex_0: {
		flex: 0,
	},
	flex_1: {
		flex: 1,
	},
	flex_2: {
		flex: 2,
	},
	flex_3: {
		flex: 3,
	},
	flex_4: {
		flex: 4,
	},
	flex_5: {
		flex: 5,
	},
	flex_6: {
		flex: 6,
	},
	flex_7: {
		flex: 7,
	},
	flex_8: {
		flex: 8,
	},
	flex_9: {
		flex: 9,
	},
	flex_10: {
		flex: 10,
	},

	// Border Radius
	rounded_5: {
		borderRadius: 5,
	},
	rounded_10: {
		borderRadius: 10,
	},
	rounded_15: {
		borderRadius: 15,
	},
	rounded_20: {
		borderRadius: 20,
	},
	rounded_25: {
		borderRadius: 25,
	},
	rounded_30: {
		borderRadius: 30,
	},
	rounded_35: {
		borderRadius: 35,
	},
	rounded_40: {
		borderRadius: 40,
	},
	rounded_45: {
		borderRadius: 45,
	},
	rounded_50: {
		borderRadius: 50,
	},
	rounded_55: {
		borderRadius: 55,
	},
	rounded_60: {
		borderRadius: 60,
	},
	rounded_65: {
		borderRadius: 65,
	},
	rounded_70: {
		borderRadius: 70,
	},
	rounded_75: {
		borderRadius: 75,
	},
	rounded_80: {
		borderRadius: 80,
	},
	rounded_85: {
		borderRadius: 85,
	},
	rounded_90: {
		borderRadius: 90,
	},
	rounded_95: {
		borderRadius: 95,
	},
	rounded_100: {
		borderRadius: 100,
	},

	// Text Styles
	text_center: {
		textAlign: 'center',
	},
	text_start: {
		textAlign: 'left',
	},
	text_end: {
		textAlign: 'right',
	},
	text_justify: {
		textAlign: 'justify',
	},
	text_italic: {
		fontStyle: 'italic',
	},
	text_underline: {
		textDecorationLine: 'underline',
	},
	text_uppercase: {
		textTransform: 'uppercase',
	},
	text_lowercase: {
		textTransform: 'lowercase',
	},
	text_capitalize: {
		textTransform: 'capitalize',
	},
	fs_small: {
		fontSize: 12,
	},
	fs_medium: {
		fontSize: 16,
	},
	fs_large: {
		fontSize: 20,
	},
	fw_normal: {
		fontWeight: 'normal',
	},
	fw_bold: {
		fontWeight: 'bold',
	},
	fw_100: {
		fontWeight: '100',
	},
	fw_200: {
		fontWeight: '200',
	},
	fw_300: {
		fontWeight: '300',
	},
	fw_400: {
		fontWeight: '400',
	},
	fw_500: {
		fontWeight: '500',
	},
	fw_600: {
		fontWeight: '600',
	},
	fw_700: {
		fontWeight: '700',
	},
	fw_800: {
		fontWeight: '800',
	},
	fw_900: {
		fontWeight: '900',
	},

	//fonts
	outfit400: {
		fontFamily: 'Outfit_400Regular'
	},
	outfit500: {
		fontFamily: 'Outfit_500Medium'
	},
	outfit600: {
		fontFamily: 'Outfit_600SemiBold'
	},

	// zIndex
	zn_2: {
		zIndex: -2,
	},
	zn_1: {
		zIndex: -1,
	},
	z_0: {
		zIndex: 0,
	},
	z_1: {
		zIndex: 1,
	},
	z_2: {
		zIndex: 2,
	},
	z_3: {
		zIndex: 3,
	},
	z_4: {
		zIndex: 4,
	},
	z_5: {
		zIndex: 5,
	},

	// Opacity
	opacity_0: {
		opacity: 0,
	},
	opacity_10: {
		opacity: 0.1,
	},
	opacity_20: {
		opacity: 0.2,
	},
	opacity_30: {
		opacity: 0.3,
	},
	opacity_40: {
		opacity: 0.4,
	},
	opacity_50: {
		opacity: 0.5,
	},
	opacity_60: {
		opacity: 0.6,
	},
	opacity_70: {
		opacity: 0.7,
	},
	opacity_80: {
		opacity: 0.8,
	},
	opacity_90: {
		opacity: 0.9,
	},
	opacity_100: {
		opacity: 1,
	},
});

export default base;
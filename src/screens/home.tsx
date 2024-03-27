import { StyleSheet, View, Text, SafeAreaView, Dimensions, LayoutChangeEvent, ScrollView, Image } from 'react-native';

import { base } from "../css/base";
import { colors } from '../css/colors'
import FontAwesome from '@expo/vector-icons/FontAwesome';

import React from 'react';

import Tabs from '~/navigation/tabs';

export default function Home() {
  return (
    <SafeAreaView style={[styles.container, base.flex_1]}>
      <View style={[base.flex_1]}>
        <View style={[base.flexRow, base.flexSpaceBetween, base.alignItemsCenter, base.pb_25, base.px_30]}>
          <View style={[base.flexRow, base.alignItemsCenter, base.gap_12]}>
            <FontAwesome name='user-circle' color={colors.white} size={52} />
            {/* TODO: Aplicar foto do usuário */}
            <View style={[base.gap_4]}>
              <Text style={styles.text}>[Nome]</Text>
              <Text style={styles.text}>[Email]</Text>
            </View>
          </View>
          <View style={[styles.containerUser]}>
            <Image source={require('./../assets/images/user-circle.png')} style={styles.iconUser} />
          </View>
        </View>
        <Tabs />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray_900,
    paddingTop: 25,
  },
  text: {
    fontFamily: 'Outfit_500Medium',
    color: colors.white_100,
    fontSize: 14,
    lineHeight: 20,
  },
  containerUser: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: colors.gray_800,
    justifyContent: 'center',
    alignItems: 'center' 
  },
  iconUser: {
    width: 27,
    height: 27
  }
})
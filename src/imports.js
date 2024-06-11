// imports.js

// React e componentes do React Native
import React from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Button,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

// Bibliotecas externas
import { Bar } from 'react-native-progress';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// Estilos personalizados
import { colors } from './css/colors';
import { base } from './css/base';

// Navegação
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Tipos de telas para transações
import { TypeScreem } from '~/enums';

// Interfaces
import { ITransaction } from '~/interfaces';

// Exporta tudo usando named exports
export {
  React,
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Bar,
  MaterialIcons,
  FontAwesome5,
  Image,
  ImageBackground,
  Button,
  Platform,
  TouchableWithoutFeedback,
  colors,
  base,
  useNavigation,
  StackNavigationProp,
  TypeScreem,
  ITransaction,
};

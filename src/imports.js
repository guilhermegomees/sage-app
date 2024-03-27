// imports.js

// React e componentes do React Native
import React from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native';

// Bibliotecas externas
import { Bar } from 'react-native-progress';
import { MaterialIcons } from '@expo/vector-icons';

// Estilos personalizados
import { colors } from './css/colors';
import { base } from './css/base';

// Navegação
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Exporta tudo usando named exports
export {
  React,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Bar,
  MaterialIcons,
  Image,
  ImageBackground,
  colors,
  base,
  useNavigation,
  StackNavigationProp,
};

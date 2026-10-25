import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useCart } from '../state/cart';
import { colors } from '../lib/theme';

export function CartButton() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { totals } = useCart();
  return (
    <Pressable onPress={() => navigation.navigate('Cart')} hitSlop={8} testID="header-cart">
      <Text style={styles.text}>Cart{totals.itemCount > 0 ? ` (${totals.itemCount})` : ''}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({ text: { color: colors.brandText, fontWeight: '600', fontSize: 15 } });

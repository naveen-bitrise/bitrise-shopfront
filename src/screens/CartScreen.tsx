import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useCart } from '../state/cart';
import { ProductImage } from '../components/ProductImage';
import { formatPrice, lineTotal } from '../lib/format';
import { colors, spacing } from '../lib/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export function CartScreen({ navigation }: Props) {
  const { lines, totals, dispatch } = useCart();

  if (lines.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Pressable onPress={() => navigation.navigate('Home')} style={styles.secondary}>
          <Text style={styles.secondaryText}>Browse products</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={lines}
        keyExtractor={(l) => `${l.productId}:${l.variantId}`}
        contentContainerStyle={{ padding: spacing(2), gap: spacing(1.5) }}
        renderItem={({ item }) => (
          <View style={styles.line}>
            <ProductImage uri={item.image} style={styles.thumb} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.muted}>{item.variantLabel}</Text>
              <Text style={styles.price}>{formatPrice(lineTotal(item.price, item.quantity))}</Text>
            </View>
            <View style={styles.qty}>
              <Pressable onPress={() => dispatch({ type: 'setQuantity', productId: item.productId, variantId: item.variantId, quantity: item.quantity - 1 })} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>−</Text>
              </Pressable>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <Pressable onPress={() => dispatch({ type: 'setQuantity', productId: item.productId, variantId: item.variantId, quantity: item.quantity + 1 })} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>+</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
      <View style={styles.summary}>
        <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
        <Row label="Shipping" value={totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)} />
        <Row label="Total" value={formatPrice(totals.total)} bold />
        <Pressable onPress={() => navigation.navigate('Checkout')} style={styles.cta} testID="checkout">
          <Text style={styles.ctaText}>Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowText, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.rowText, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  line: { flexDirection: 'row', alignItems: 'center', gap: spacing(1.5), backgroundColor: colors.card, padding: spacing(1.5), borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  thumb: { width: 64, height: 64, borderRadius: 8 },
  name: { fontWeight: '600', color: colors.text },
  muted: { color: colors.muted, fontSize: 13 },
  price: { color: colors.brand, fontWeight: '700' },
  qty: { flexDirection: 'row', alignItems: 'center', gap: spacing(1) },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 18, color: colors.text },
  qtyText: { minWidth: 20, textAlign: 'center', fontWeight: '600' },
  summary: { backgroundColor: colors.card, padding: spacing(2), gap: spacing(1), borderTopWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowText: { fontSize: 15, color: colors.text },
  bold: { fontWeight: '700', fontSize: 17 },
  cta: { marginTop: spacing(1), backgroundColor: colors.brand, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  ctaText: { color: colors.brandText, fontSize: 16, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing(2), backgroundColor: colors.bg },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  secondary: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.brand },
  secondaryText: { color: colors.brand, fontWeight: '600' },
});

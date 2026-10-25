import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Product } from '../data/types';
import { formatPrice } from '../lib/format';
import { colors, spacing } from '../lib/theme';
import { ProductImage } from './ProductImage';

export function ProductCard({ product, onPress }: { product: Product; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.card} accessibilityRole="button" testID={`product-${product.id}`}>
      <ProductImage uri={product.image} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, margin: spacing(0.75), backgroundColor: colors.card, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  image: { width: '100%', aspectRatio: 1 },
  body: { padding: spacing(1.25), gap: 2 },
  brand: { fontSize: 11, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { fontSize: 14, fontWeight: '600', color: colors.text, minHeight: 36 },
  price: { fontSize: 15, fontWeight: '700', color: colors.brand, marginTop: 4 },
});

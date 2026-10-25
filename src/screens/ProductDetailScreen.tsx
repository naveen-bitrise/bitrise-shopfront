import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useCatalog } from '../state/catalog';
import { useCart } from '../state/cart';
import { ProductImage } from '../components/ProductImage';
import { formatPrice } from '../lib/format';
import { colors, spacing } from '../lib/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export function ProductDetailScreen({ route, navigation }: Props) {
  const { products } = useCatalog();
  const { dispatch } = useCart();
  const product = products.find((p) => p.id === route.params.productId);
  const [variantId, setVariantId] = useState(product?.variants.find((v) => v.available)?.id);

  if (!product) {
    return (
      <View style={styles.missing}>
        <Text style={styles.muted}>This product is no longer available.</Text>
      </View>
    );
  }

  const variant = product.variants.find((v) => v.id === variantId);

  const addToCart = () => {
    if (!variant || !variant.available) return;
    dispatch({ type: 'add', product, variant });
    Alert.alert('Added to cart', `${product.name} (${variant.label})`, [
      { text: 'Keep shopping', style: 'cancel' },
      { text: 'View cart', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ProductImage uri={product.image} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.rating}>{'★'.repeat(Math.round(product.rating))} {product.rating.toFixed(1)}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <Text style={styles.section}>Options</Text>
        <View style={styles.variants}>
          {product.variants.map((v) => (
            <Pressable
              key={v.id}
              disabled={!v.available}
              onPress={() => setVariantId(v.id)}
              style={[styles.variant, v.id === variantId && styles.variantActive, !v.available && styles.variantDisabled]}
            >
              <Text style={[styles.variantText, v.id === variantId && styles.variantTextActive]}>
                {v.label}{v.available ? '' : ' · sold out'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={addToCart}
          disabled={!variant?.available}
          style={[styles.cta, !variant?.available && styles.ctaDisabled]}
          testID="add-to-cart"
        >
          <Text style={styles.ctaText}>{variant?.available ? 'Add to cart' : 'Sold out'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.card },
  content: { paddingBottom: spacing(4) },
  image: { width: '100%', aspectRatio: 1 },
  body: { padding: spacing(2), gap: spacing(0.75) },
  brand: { fontSize: 12, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { fontSize: 22, fontWeight: '700', color: colors.text },
  rating: { color: colors.sale, fontSize: 13 },
  price: { fontSize: 22, fontWeight: '700', color: colors.brand, marginTop: spacing(0.5) },
  description: { fontSize: 15, color: colors.text, lineHeight: 21, marginTop: spacing(1) },
  section: { fontSize: 13, fontWeight: '600', color: colors.muted, marginTop: spacing(2), textTransform: 'uppercase' },
  variants: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(1) },
  variant: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  variantActive: { borderColor: colors.brand, backgroundColor: '#E8F2EC' },
  variantDisabled: { opacity: 0.45 },
  variantText: { color: colors.text },
  variantTextActive: { color: colors.brand, fontWeight: '600' },
  cta: { marginTop: spacing(3), backgroundColor: colors.brand, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  ctaDisabled: { backgroundColor: colors.muted },
  ctaText: { color: colors.brandText, fontSize: 16, fontWeight: '700' },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: colors.muted },
});

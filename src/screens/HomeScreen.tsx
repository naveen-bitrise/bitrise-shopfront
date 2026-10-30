import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { CATEGORIES, type Category } from '../data/api';
import { useCatalog } from '../state/catalog';
import { ProductCard } from '../components/ProductCard';
import { ReleaseBadge } from '../components/ReleaseBadge';
import { colors, spacing } from '../lib/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { products, loading, refresh } = useCatalog();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('All');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (q === '' || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)),
    );
  }, [products, query, category]);

  return (
    <FlatList
      style={styles.list}
      data={visible}
      numColumns={2}
      keyExtractor={(p) => p.id}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search tools, garden, kitchen…"
            placeholderTextColor={colors.muted}
            style={styles.search}
            testID="search"
          />
          <View style={styles.chips}>
            {CATEGORIES.map((c) => (
              <Pressable key={c} onPress={() => setCategory(c)} style={[styles.chip, c === category && styles.chipActive]}>
                <Text style={[styles.chipText, c === category && styles.chipTextActive]}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      }
      ListEmptyComponent={loading ? null : <Text style={styles.empty}>No products match your search.</Text>}
      ListFooterComponent={<ReleaseBadge />}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={() => navigation.navigate('ProductDetail', { productId: item.id })} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { backgroundColor: colors.bg },
  content: { padding: spacing(1) },
  header: { paddingHorizontal: spacing(0.75), paddingTop: spacing(1), gap: spacing(1.5), marginBottom: spacing(0.5) },
  search: { backgroundColor: colors.card, borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: colors.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(1) },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { color: colors.text, fontSize: 13 },
  chipTextActive: { color: colors.brandText, fontWeight: '600' },
  empty: { textAlign: 'center', color: colors.muted, marginTop: spacing(4) },
});

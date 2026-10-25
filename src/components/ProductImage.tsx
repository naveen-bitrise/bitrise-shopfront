import React from 'react';
import { Image, StyleSheet, Text, View, type ImageStyle, type StyleProp } from 'react-native';
import { colors } from '../lib/theme';

export function ProductImage({ uri, style }: { uri: string | null; style?: StyleProp<ImageStyle> }) {
  if (!uri) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={styles.placeholderText}>No image</Text>
      </View>
    );
  }
  return <Image source={{ uri }} style={[styles.image, style]} resizeMode="cover" />;
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.border },
  placeholder: { backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: colors.muted, fontSize: 12 },
});

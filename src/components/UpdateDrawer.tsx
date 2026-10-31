import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { UpdateOffer } from '../lib/useCodePushUpdates';
import { colors, spacing } from '../lib/theme';

type Props = {
  offer: UpdateOffer | null;
  progress: number | null;
  onAccept: () => void;
  onLater: () => void;
};

// Bottom drawer offering an optional CodePush update.
export function UpdateDrawer({ offer, progress, onAccept, onLater }: Props) {
  const insets = useSafeAreaInsets();
  const slide = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    Animated.spring(slide, { toValue: offer ? 0 : 400, useNativeDriver: true, bounciness: 4 }).start();
  }, [offer, slide]);

  if (!offer) return null;
  const downloading = progress !== null;
  const sizeKb = Math.max(1, Math.round(offer.sizeBytes / 1024));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none" testID="update-drawer">
      <Pressable style={styles.backdrop} onPress={downloading ? undefined : onLater} />
      <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + spacing(2), transform: [{ translateY: slide }] }]}>
        <View style={styles.handle} />
        <View style={styles.row}>
          <Text style={styles.title}>Update available</Text>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{offer.label}</Text>
          </View>
        </View>
        {offer.description ? <Text style={styles.description}>{offer.description}</Text> : null}
        <Text style={styles.meta}>{sizeKb} KB · installs in seconds, no App Store needed</Text>

        {downloading ? (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.round((progress ?? 0) * 100)}%` }]} />
          </View>
        ) : (
          <View style={styles.actions}>
            <Pressable onPress={onLater} style={[styles.button, styles.secondary]} testID="update-later">
              <Text style={styles.secondaryText}>Later</Text>
            </Pressable>
            <Pressable onPress={onAccept} style={[styles.button, styles.primary]} testID="update-now">
              <Text style={styles.primaryText}>Update now</Text>
            </Pressable>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing(2.5),
    paddingTop: spacing(1.5),
    gap: spacing(1.25),
  },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.border, marginBottom: spacing(0.5) },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  pill: { backgroundColor: '#E8F2EC', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  pillText: { color: colors.brand, fontWeight: '800' },
  description: { fontSize: 15, color: colors.text, lineHeight: 21 },
  meta: { fontSize: 12, color: colors.muted },
  actions: { flexDirection: 'row', gap: spacing(1.5), marginTop: spacing(1) },
  button: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primary: { backgroundColor: colors.brand },
  primaryText: { color: colors.brandText, fontWeight: '700', fontSize: 16 },
  secondary: { borderWidth: 1, borderColor: colors.border },
  secondaryText: { color: colors.text, fontWeight: '600', fontSize: 16 },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden', marginTop: spacing(1.5) },
  progressFill: { height: 8, backgroundColor: colors.brand },
});

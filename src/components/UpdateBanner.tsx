import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import codePush from '@bitrise/code-push-sdk';
import { colors, spacing } from '../lib/theme';

const VISIBLE_MS = 8000;

// Shows a "What's new" banner the first time a CodePush update runs, so a new release
// is obvious on screen (demos, testers). Silent install stays unchanged.
export function UpdateBanner() {
  const insets = useSafeAreaInsets();
  const [info, setInfo] = useState<{ label: string; description: string } | null>(null);
  const slide = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    codePush
      .getUpdateMetadata()
      .then((pkg) => {
        if (pkg?.isFirstRun) {
          setInfo({ label: pkg.versionLabel ?? pkg.label, description: pkg.description ?? '' });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!info) return;
    Animated.spring(slide, { toValue: 0, useNativeDriver: true }).start();
    const timer = setTimeout(hide, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [info]);

  function hide() {
    Animated.timing(slide, { toValue: -120, duration: 250, useNativeDriver: true }).start(() => setInfo(null));
  }

  if (!info) return null;

  return (
    <Animated.View
      style={[styles.wrap, { paddingTop: insets.top + spacing(1), transform: [{ translateY: slide }] }]}
      accessibilityRole="alert"
      testID="update-banner"
    >
      <Pressable onPress={hide} style={styles.banner}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{info.label}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>App updated</Text>
          {info.description ? (
            <Text style={styles.body} numberOfLines={2}>
              {info.description}
            </Text>
          ) : null}
        </View>
        <Text style={styles.close}>✕</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: spacing(1.5), zIndex: 100 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1.5),
    backgroundColor: '#1B7F4B',
    borderRadius: 14,
    padding: spacing(1.5),
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  pill: { backgroundColor: colors.brandText, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  pillText: { color: '#1B7F4B', fontWeight: '800', fontSize: 13 },
  title: { color: colors.brandText, fontWeight: '700', fontSize: 15 },
  body: { color: '#E3F4EA', fontSize: 13, marginTop: 2 },
  close: { color: colors.brandText, fontSize: 16, paddingHorizontal: 4 },
});

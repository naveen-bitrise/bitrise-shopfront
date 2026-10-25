import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import codePush from '@code-push-next/react-native-code-push';
import Constants from 'expo-constants';
import { colors } from '../lib/theme';

// Shows binary version + CodePush label so testers can tell which release is running.
export function ReleaseBadge() {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    codePush
      .getUpdateMetadata()
      .then((m) => setLabel(m?.label ?? null))
      .catch(() => setLabel(null));
  }, []);
  const version = Constants.expoConfig?.version ?? '?';
  return <Text style={styles.text}>v{version}{label ? ` · update ${label}` : ' · no update'}</Text>;
}

const styles = StyleSheet.create({ text: { textAlign: 'center', color: colors.muted, fontSize: 11, paddingVertical: 12 } });

import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useCart } from '../state/cart';
import { formatPrice } from '../lib/format';
import { colors, spacing } from '../lib/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

// Mock checkout: no real payment is taken.
export function CheckoutScreen({ navigation }: Props) {
  const { totals, dispatch } = useCart();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [card, setCard] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);

  const valid = name.trim().length > 1 && address.trim().length > 5 && card.replace(/\D/g, '').length >= 12;

  const placeOrder = () => {
    if (!valid) return;
    setOrderId(`SF-${Date.now().toString().slice(-6)}`);
    dispatch({ type: 'clear' });
  };

  if (orderId) {
    return (
      <View style={styles.done}>
        <Text style={styles.doneTitle}>Order placed</Text>
        <Text style={styles.muted}>Order {orderId}. A confirmation is on its way.</Text>
        <Pressable onPress={() => navigation.popToTop()} style={styles.cta}>
          <Text style={styles.ctaText}>Back to shop</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Field label="Full name" value={name} onChangeText={setName} testID="checkout-name" />
        <Field label="Delivery address" value={address} onChangeText={setAddress} multiline testID="checkout-address" />
        <Field label="Card number (test)" value={card} onChangeText={setCard} keyboardType="number-pad" testID="checkout-card" />
        <View style={styles.total}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>{formatPrice(totals.total)}</Text>
        </View>
        <Pressable onPress={placeOrder} disabled={!valid} style={[styles.cta, !valid && styles.ctaDisabled]} testID="place-order">
          <Text style={styles.ctaText}>Place order</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field(props: React.ComponentProps<typeof TextInput> & { label: string }) {
  const { label, style, ...rest } = props;
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...rest} placeholderTextColor={colors.muted} style={[styles.input, style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.bg },
  content: { padding: spacing(2), gap: spacing(2) },
  label: { fontSize: 13, fontWeight: '600', color: colors.muted },
  input: { backgroundColor: colors.card, borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.text },
  total: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing(1) },
  totalText: { fontSize: 17, fontWeight: '700', color: colors.text },
  cta: { backgroundColor: colors.brand, borderRadius: 12, paddingVertical: 16, alignItems: 'center', alignSelf: 'stretch' },
  ctaDisabled: { backgroundColor: colors.muted },
  ctaText: { color: colors.brandText, fontSize: 16, fontWeight: '700' },
  done: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing(2), padding: spacing(3), backgroundColor: colors.bg },
  doneTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  muted: { color: colors.muted, textAlign: 'center' },
});

import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import codePush from '@bitrise/code-push-sdk';
import type { RootStackParamList } from './src/navigation';
import { CartProvider } from './src/state/cart';
import { CatalogProvider } from './src/state/catalog';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { CartScreen } from './src/screens/CartScreen';
import { CheckoutScreen } from './src/screens/CheckoutScreen';
import { CartButton } from './src/components/CartButton';
import { colors } from './src/lib/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Silent CodePush sync on start and every time the app returns to the foreground
// (Bitrise docs: "Silent sync every time the app resumes"). Testers pick up a new
// update by backgrounding and reopening the app.
function useCodePushSync() {
  useEffect(() => {
    const syncOptions = { installMode: codePush.InstallMode.ON_NEXT_RESUME };
    codePush.sync(syncOptions);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') codePush.sync(syncOptions);
    });
    return () => subscription.remove();
  }, []);
}

export default function App() {
  useCodePushSync();
  return (
    <SafeAreaProvider>
      <CatalogProvider>
        <CartProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: colors.brand },
                headerTintColor: colors.brandText,
                headerTitleStyle: { fontWeight: '700' },
                headerRight: () => <CartButton />,
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Shopfront' }} />
              <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: '' }} />
              <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Your cart', headerRight: undefined }} />
              <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout', headerRight: undefined }} />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="light" />
        </CartProvider>
      </CatalogProvider>
    </SafeAreaProvider>
  );
}

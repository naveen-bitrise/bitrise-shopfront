import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { RootStackParamList } from './src/navigation';
import { CartProvider } from './src/state/cart';
import { CatalogProvider } from './src/state/catalog';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { CartScreen } from './src/screens/CartScreen';
import { CheckoutScreen } from './src/screens/CheckoutScreen';
import { CartButton } from './src/components/CartButton';
import { UpdateBanner } from './src/components/UpdateBanner';
import { UpdateDrawer } from './src/components/UpdateDrawer';
import { useCodePushUpdates } from './src/lib/useCodePushUpdates';
import { colors } from './src/lib/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

function Updates() {
  // Mandatory updates install and restart silently; optional ones are offered in the drawer.
  const { offer, progress, accept, later } = useCodePushUpdates();
  return <UpdateDrawer offer={offer} progress={progress} onAccept={accept} onLater={later} />;
}

export default function App() {
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
          <Updates />
          <UpdateBanner />
          <StatusBar style="light" />
        </CartProvider>
      </CatalogProvider>
    </SafeAreaProvider>
  );
}

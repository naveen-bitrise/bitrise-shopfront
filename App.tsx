import React from 'react';
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

function App() {
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

// Check for a CodePush update on every app start and install it on next restart,
// so a rollout reaches testers predictably.
export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
})(App);

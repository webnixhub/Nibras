import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { useNibrasStore } from './src/store/useNibrasStore';

export default function App() {
  const hasHydrated = useNibrasStore((s) => s.hasHydrated);
  const resetDailyIfNeeded = useNibrasStore((s) => s.resetDailyIfNeeded);

  useEffect(() => {
    if (hasHydrated) {
      resetDailyIfNeeded();
    }
  }, [hasHydrated, resetDailyIfNeeded]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

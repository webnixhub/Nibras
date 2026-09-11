import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { useNibrasStore } from './src/store/useNibrasStore';
import { useNibrasFonts } from './src/theme/useNibrasFonts';
import { color } from './src/theme/tokens';

export default function App() {
  const hasHydrated = useNibrasStore((s) => s.hasHydrated);
  const resetDailyIfNeeded = useNibrasStore((s) => s.resetDailyIfNeeded);
  const { fontsLoaded } = useNibrasFonts();

  useEffect(() => {
    if (hasHydrated) {
      resetDailyIfNeeded();
    }
  }, [hasHydrated, resetDailyIfNeeded]);

  // Block on BOTH store hydration and font loading — headers/labels using
  // Orbitron/ShareTechMono would flash system-font-then-swap if rendered
  // before fonts resolve. This adds to whatever the existing hydration
  // wait already was; if that felt fast before, expect a slightly longer
  // (still sub-second on-device) blank/spinner window now.
  if (!hasHydrated || !fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: color.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={color.aiAccent} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

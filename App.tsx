import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Sentry from '@sentry/react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { useNibrasStore } from './src/store/useNibrasStore';

Sentry.init({
  dsn: 'https://3dcf51a359b9c19404505e767978ff8d@o4511924981465088.ingest.us.sentry.io/4511924984217600',
  debug: false,
  tracesSampleRate: 1.0,
  enableNativeCrashHandling: true,
  enableAutoSessionTracking: true,
});

function App() {
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

export default Sentry.wrap(App);

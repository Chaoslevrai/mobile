// app/_layout.tsx
// Remplace ton _layout.tsx existant

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SaeProvider } from '@/src/context/SaeContext';
import { COLORS } from '@/src/constants';

export default function RootLayout() {
  return (
    <SaeProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.surface },
          headerTintColor: COLORS.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="sae/[id]"
          options={{ title: 'Détail SAé' }}
        />
        <Stack.Screen
          name="gallery"
          options={{ title: 'Galerie' }}
        />
      </Stack>
    </SaeProvider>
  );
}

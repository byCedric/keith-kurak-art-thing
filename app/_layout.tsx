import { Stack } from "expo-router";

import { AssetsProvider } from '@/providers/assets';
import { QueryProvider } from '@/providers/query';
import { SplashScreenProvider } from '@/providers/splash';
import { ThemeProvider } from '@/providers/theme';

// Catch any errors thrown by the Layout component or children
export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(app)",
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AssetsProvider>
          <SplashScreenProvider>
            <Stack screenOptions={{ headerBackTitleVisible: false }}>
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            </Stack>
          </SplashScreenProvider>
        </AssetsProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}

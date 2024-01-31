import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { type PropsWithChildren } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

export function ThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {children}
    </NavigationThemeProvider>
  );
}

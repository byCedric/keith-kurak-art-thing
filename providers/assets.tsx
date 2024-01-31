import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { type FontSource, useFonts } from 'expo-font';
import { type PropsWithChildren } from 'react';

const fonts: Record<string, FontSource> = {
  SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  ...FontAwesome.font,
  ...FontAwesome6.font,
};

export function AssetsProvider({ children }: PropsWithChildren) {
  const [fontsAreLoaded, fontsError] = useFonts(fonts);

  // Throw any lont loading errors to the error boundary
  if (fontsError) throw fontsError;
  // Do not render the children until all fonts are loaded
  if (!fontsAreLoaded) return null;

  return children;
}

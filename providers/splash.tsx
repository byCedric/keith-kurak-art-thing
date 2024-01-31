import * as SplashScreen from "expo-splash-screen";
import { type PropsWithChildren } from 'react';

// Prevent auto-hiding splash screen until the splash screen provider is rendered
// See: https://docs.expo.io/versions/latest/sdk/splash-screen/#splashscreenpreventautohideasync
SplashScreen.preventAutoHideAsync();

export function SplashScreenProvider({ children }: PropsWithChildren) {
  // Hide the splash screen when the children are ready to render
  if (children) SplashScreen.hideAsync();

  return children;
}

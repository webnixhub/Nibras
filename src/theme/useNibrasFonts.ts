import { useFonts } from 'expo-font';
import { Orbitron_400Regular, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { ShareTechMono_400Regular } from '@expo-google-fonts/share-tech-mono';

/**
 * Loads the terminal-redesign font set (tokens.ts `font.display` /
 * `font.mono`). Gate rendering in App.tsx on `fontsLoaded === true` —
 * referencing these family names before load resolves silently falls back
 * to the system font with no error, so don't skip the gate "to save time."
 *
 * package.json additions required:
 *   "@expo-google-fonts/orbitron": "*"
 *   "@expo-google-fonts/share-tech-mono": "*"
 *   "expo-font": "*"  (usually already present via Expo SDK)
 */
export function useNibrasFonts() {
  const [fontsLoaded, fontError] = useFonts({
    Orbitron_400Regular,
    Orbitron_700Bold,
    ShareTechMono_400Regular,
  });

  // fontError is non-fatal by design — if Google Fonts packages are
  // missing/misconfigured, fall through to system font rather than hard-
  // block the whole app on a cosmetic dependency during Shipaton crunch.
  return { fontsLoaded: fontsLoaded || !!fontError, fontError };
}

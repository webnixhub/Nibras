/** @type {import('expo/config').ExpoConfig} */
const expoConfig = {
  name: 'Nibras',
  slug: 'nibras',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0B0F14',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.webnixhub.nibras',
    infoPlist: {
      NSDocumentsFolderUsageDescription:
        'Nibras reads project files you select to scan for security issues.',
    },
  },
  android: {
    package: 'com.webnixhub.nibras',
    minSdkVersion: 29,
    allowBackup: false, // prevents Android auto-restoring AsyncStorage/app data on reinstall
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0B0F14',
    },
    permissions: ['READ_EXTERNAL_STORAGE'],
  },
  plugins: [
    'expo-document-picker',
    [
      'expo-build-properties',
      {
        android: {
          kotlinVersion: '2.1.20',
          minSdkVersion: 29,
          compileSdkVersion: 36,
        },
      },
    ],
    // Reverted to the documented plain-string form. QVAC's current official
    // Expo tutorial configures this exact way, no jiti/dynamic require needed:
    // https://docs.qvac.tether.io/tutorials/expo/
    // The previous jiti + withQvacSDK() workaround was undocumented and is
    // the more likely source of "Cannot find module" during EAS prebuild --
    // jiti's subpath resolution isn't guaranteed to match Node's native
    // resolver, which is what Expo's own config-plugin loader uses.
    '@qvac/sdk/expo-plugin',
    //
    // REMOVED: '@react-native-vector-icons/ionicons' -- not in package.json.
    // Re-add only after adding the matching dependency, or this throws
    // the identical "Cannot find module" error you're already fighting.
  ],
  extra: {
    eas: {
      projectId: '1928534d-3f4f-4e72-b1a8-c10f2a6c5aac',
    },
  },
};

module.exports = ({ config }) => {
  // Dynamic app.config.js must return the ExpoConfig object directly --
  // NOT { ...config, expo: ... }. That malformed shape is what produced
  // "Config `_internal.projectRoot` isn't defined by expo-cli" on EAS:
  // the loader choked trying to read _internal off a top-level object
  // that was never a valid ExpoConfig in the first place.
  return {
    ...config,
    ...expoConfig,
  };
};

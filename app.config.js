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
    allowBackup: false,
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
          // Excludes GPU compute backends this app can never use: device is
          // hardcoded to 'cpu' in qvacClient.ts (LM-G850's Adreno 640 is
          // below QVAC's stated GPU minimum). Confirmed via `du` on a real
          // built APK: libqvac-ggml-vulkan.so (85MB) + libqvac-ggml-opencl.so
          // (2.6MB) = ~87.6MB dead weight, the single largest chunk of the
          // 231MB->150MB overage. Real filenames confirmed on-device, NOT
          // the stock template's existing (and ineffective) libOpenCL.so
          // exclude, which is a different, unrelated file. Uses the native
          // packagingOptions.exclude field (verified via expo-build-properties
          // pluginConfig.d.ts), not a hand-built gradleProperties string
          // (that first attempt didn't write anything - confirmed empty
          // grep against generated android/gradle.properties).
          packagingOptions: {
            exclude: ['**/libqvac-ggml-vulkan.so', '**/libqvac-ggml-opencl.so'],
          },
        },
      },
    ],
    '@qvac/sdk/expo-plugin',
  ],
  extra: {
    eas: {
      projectId: '1928534d-3f4f-4e72-b1a8-c10f2a6c5aac',
    },
  },
  updates: {
    url: 'https://u.expo.dev/1928534d-3f4f-4e72-b1a8-c10f2a6c5aac',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
};

module.exports = ({ config }) => {
  return {
    ...config,
    ...expoConfig,
  };
};

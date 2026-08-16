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
          // FIX: previous EAS/Actions build failed with
          // `java.lang.OutOfMemoryError: Metaspace` during
          // mergeReleaseResources + parallel lintVitalAnalyzeRelease
          // tasks (react-native-screens, expo-modules-core) on a
          // constrained CI runner (GitHub Actions ubuntu-latest: 2
          // vCPU / 7GB RAM). Default Gradle JVM args don't reserve
          // enough Metaspace for a dependency graph this size.
          // Raises heap + Metaspace ceiling and disables parallel
          // task execution so lint/merge tasks don't compete for the
          // same constrained memory pool simultaneously. Costs some
          // build time, buys headroom. If this still OOMs, the next
          // lever is lowering runner concurrency further or moving
          // to a larger runner tier — not raising these numbers
          // indefinitely.
          gradleProperties: {
            'org.gradle.jvmargs': '-Xmx4096m -XX:MaxMetaspaceSize=1024m',
            'org.gradle.parallel': 'false',
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

const createJiti = require('jiti');
const jiti = createJiti(__filename);

let withQvacSDK = null;
try {
  // Attempt to load the QVAC expo plugin programmatically (ESM-safe via jiti)
  const qvacModule = jiti('@qvac/sdk/expo-plugin');
  withQvacSDK = qvacModule.withQvacSDK || qvacModule.default || null;
  if (typeof withQvacSDK !== 'function') {
    console.warn(
      '[app.config.js] @qvac/sdk/expo-plugin loaded but exported value is not a function.',
      'Export keys:', Object.keys(qvacModule || {})
    );
    withQvacSDK = null;
  }
} catch (err) {
  // Clear, actionable log — this is likely the "Cannot find module" you're seeing.
  console.warn(
    '[app.config.js] Could not load @qvac/sdk/expo-plugin via jiti. ' +
      'This prevents QVAC from embedding the mobile worker bundle.\n' +
      'Make sure @qvac/sdk is installed and that the package exports an expo-plugin at "@qvac/sdk/expo-plugin".\n' +
      'Run: npm install @qvac/sdk --save\n' +
      'Or check the installed package contents under node_modules/@qvac/sdk\n' +
      'Original error:',
    err && err.message ? err.message : err
  );
  // leave withQvacSDK null to allow graceful fallback below
}

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
        },
      },
    ],
    // '@qvac/sdk/expo-plugin' intentionally not listed as a string due to ESM plugin load issues.
  ],
  extra: {
    eas: {
      projectId: '1928534d-3f4f-4e72-b1a8-c10f2a6c5aac',
    },
  },
};

module.exports = ({ config }) => {
  const base = {
    ...config,
    ...expoConfig,
  };

  if (withQvacSDK) {
    // withQvacSDK should be a function that accepts an ExpoConfig and returns a modified ExpoConfig
    try {
      return withQvacSDK(base);
    } catch (err) {
      console.warn('[app.config.js] withQvacSDK plugin threw an error:', err && err.message ? err.message : err);
      // Fall back to returning unmodified config so the build can still run (but plugin missing)
      return base;
    }
  }

  // If plugin couldn't be loaded, return base config but warn the developer
  console.warn(
    '[app.config.js] QVAC expo plugin not applied. ' +
      'Deep-scan worker bundle will not be embedded. ' +
      'Install @qvac/sdk and ensure it exports the plugin at "@qvac/sdk/expo-plugin", then rebuild a custom dev client or full build.'
  );
  return base;
};

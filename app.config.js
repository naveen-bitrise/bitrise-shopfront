// Shopfront: Expo app config. CodePush keys come from env (Bitrise Secrets in CI, .env locally).
require('dotenv').config();

const IOS_CODEPUSH_DEPLOYMENT_KEY = process.env.IOS_CODEPUSH_DEPLOYMENT_KEY;
const ANDROID_CODEPUSH_DEPLOYMENT_KEY = process.env.ANDROID_CODEPUSH_DEPLOYMENT_KEY;
// Bitrise CodePush server for naveen-bitrise's Workspace
const CODEPUSH_SERVER_URL = 'https://c8e286a505ee7c81.codepush.bitrise.io';

if (!IOS_CODEPUSH_DEPLOYMENT_KEY) console.warn('IOS_CODEPUSH_DEPLOYMENT_KEY is not set; CodePush on iOS will not receive updates.');
if (!ANDROID_CODEPUSH_DEPLOYMENT_KEY) console.warn('ANDROID_CODEPUSH_DEPLOYMENT_KEY is not set; CodePush on Android will not receive updates.');

export default () => ({
  expo: {
    name: 'Shopfront',
    slug: 'shopfront',
    version: '1.0.0', // binary version: CodePush updates target this
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: { image: './assets/splash-icon.png', resizeMode: 'contain', backgroundColor: '#ffffff' },
    ios: { supportsTablet: false, bundleIdentifier: 'io.bitrise.naveen.shopfront' },
    android: {
      adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#ffffff' },
      edgeToEdgeEnabled: true,
      package: 'io.bitrise.naveen.shopfront',
    },
    plugins: [
      [
        '@bitrise/code-push-sdk/expo',
        {
          ios: { CodePushDeploymentKey: IOS_CODEPUSH_DEPLOYMENT_KEY || 'MISSING_IOS_KEY', CodePushServerURL: CODEPUSH_SERVER_URL },
          android: { CodePushDeploymentKey: ANDROID_CODEPUSH_DEPLOYMENT_KEY || 'MISSING_ANDROID_KEY', CodePushServerURL: CODEPUSH_SERVER_URL },
        },
      ],
      ['expo-build-properties', { ios: { deploymentTarget: '15.5' } }],
    ],
  },
});

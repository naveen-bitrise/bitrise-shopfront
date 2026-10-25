# Shopfront

A small retail shopping app (Expo SDK 53 with prebuild, React Native 0.79) used to evaluate a
self-healing release loop: Slack → Bitrise RDE → CI → CodePush (Bitrise Release Management) → Sentry.

## Screens

| Screen | What it does |
| --- | --- |
| Home | Product grid, search, category chips, pull to refresh; shows binary version + CodePush label |
| Product detail | Image, price, rating, variants, Add to cart |
| Cart | Line items, quantity, subtotal, shipping, total |
| Checkout | Mock checkout (no real payment), order confirmation |

The catalog is fetched from `data/products.json` on the `main` branch
(`https://raw.githubusercontent.com/naveen-bitrise/bitrise-shopfront/main/data/products.json`), with the bundled
copy as a fallback. Keep the repo public, or the app always uses the bundled copy.

## Develop

```bash
npm ci
npm run ci          # typecheck + unit tests
npx expo run:ios    # or run:android (runs prebuild)
```

## CodePush

`app.config.js` wires `@bitrise/code-push-sdk` to the Bitrise CodePush server for
naveen-bitrise's Workspace. Deployment keys come from `IOS_CODEPUSH_DEPLOYMENT_KEY` and
`ANDROID_CODEPUSH_DEPLOYMENT_KEY` (`.env` locally, Bitrise Secrets in CI).

The app checks for an update on start and installs it on the next restart.

## Bitrise workflows

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `pr` | PR to `main` | `npm run ci` |
| `ios_simulator` | manual | Release-config simulator build |
| `android_emulator` | manual | Release APK for emulators |
| `codepush_staging` | push to `main` | Bundles JS for iOS and Android and uploads to the Staging deployment; keeps source maps as artifacts |

Promotion from Staging to Production (with a rollout percentage) is done in Release Management.

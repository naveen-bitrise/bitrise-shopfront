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

`app.json` configures the `@bitrise/code-push-sdk` Expo plugin with the **Staging** deployment keys
and the Bitrise CodePush server for naveen-bitrise's Workspace. Deployment keys are not secrets.

The app syncs silently on start and every time it returns to the foreground; a downloaded update is
applied the next time the app resumes.

## Bitrise workflows

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `pr` | PR to `main` | `npm run ci` |
| `ios_simulator` | manual | Release-config simulator build |
| `android_emulator` | manual | Release APK for emulators |
| `codepush_publish` | push to `main` | Publishes iOS and Android updates to `$CODEPUSH_DEPLOYMENT` (Staging) with the Bitrise CodePush Publish Step |

Promotion from Staging to Production (with a rollout percentage) is done in Release Management.

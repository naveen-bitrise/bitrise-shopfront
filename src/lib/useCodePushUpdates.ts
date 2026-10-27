import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import codePush, { type RemotePackage } from '@bitrise/code-push-sdk';

export type UpdateOffer = {
  label: string;
  description: string;
  sizeBytes: number;
};

type State = {
  offer: UpdateOffer | null; // optional update waiting for the user's decision
  progress: number | null; // 0..1 while downloading after "Update now"
};

/**
 * CodePush update policy for Shopfront:
 * - Mandatory updates (self-healing fixes, published with `mandatory: true`) download and
 *   restart into the new version straight away, without asking.
 * - Optional updates (features) are offered in a drawer: "Update now" installs and restarts,
 *   "Later" hides the offer for that release until the app is next launched.
 * Checks run on start and every time the app returns to the foreground.
 */
export function useCodePushUpdates() {
  const [state, setState] = useState<State>({ offer: null, progress: null });
  const remoteRef = useRef<RemotePackage | null>(null);
  const busy = useRef(false);
  const dismissed = useRef(new Set<string>());

  const installNow = useCallback(async (remote: RemotePackage, showProgress: boolean) => {
    busy.current = true;
    try {
      const local = await remote.download((p) => {
        if (showProgress && p.totalBytes > 0) {
          setState((s) => ({ ...s, progress: p.receivedBytes / p.totalBytes }));
        }
      });
      await local.install(codePush.InstallMode.IMMEDIATE); // restarts the app
    } catch (err) {
      console.warn('[updates] install failed', err);
      setState({ offer: null, progress: null });
    } finally {
      busy.current = false;
    }
  }, []);

  const check = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      const remote = await codePush.checkForUpdate();
      if (!remote || remote.failedInstall) return;
      const label = remote.versionLabel ?? remote.label;
      if (remote.isMandatory) {
        busy.current = false;
        await installNow(remote, false);
        return;
      }
      if (dismissed.current.has(label)) return;
      remoteRef.current = remote;
      setState({
        offer: {
          label,
          // First line only: the description is the commit / PR message.
          description: (remote.description ?? '').split('\n')[0].trim(),
          sizeBytes: remote.packageSize ?? 0,
        },
        progress: null,
      });
    } catch (err) {
      console.warn('[updates] check failed', err);
    } finally {
      busy.current = false;
    }
  }, [installNow]);

  useEffect(() => {
    // Mark the running release as healthy so CodePush does not roll it back.
    codePush.notifyAppReady().catch(() => {});
    check();
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') check();
    });
    return () => sub.remove();
  }, [check]);

  const accept = useCallback(() => {
    if (remoteRef.current) installNow(remoteRef.current, true);
  }, [installNow]);

  const later = useCallback(() => {
    if (state.offer) dismissed.current.add(state.offer.label);
    setState({ offer: null, progress: null });
  }, [state.offer]);

  return { offer: state.offer, progress: state.progress, accept, later };
}

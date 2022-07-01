import NetInfo, { NetInfoState, NetInfoStateType, NetInfoUnknownState } from "@react-native-community/netinfo";
import firebaseStorage from "@react-native-firebase/storage";
import { isEqual } from "lodash";
import { DependencyList, useDebugValue, useEffect, useRef, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../redux/store";

export function useFirebaseStorageUrl(googleUri?: string) {
  useDebugValue(`Storage for ${googleUri ?? "undefined"}`);

  const [ state, setState ] = useState<[string | null, Error | null]>([ null, null ]);

  useEffect(() => {
    if (googleUri) {
      firebaseStorage().refFromURL(googleUri).getDownloadURL()
        .then((url) => {
          setState([ url, null ]);
        })
        .catch((error) => {
          setState([ null, error as Error ]);
        });
    }
  }, [googleUri]);

  return state;
}

export function useDeepEffect(effectFunc: () => unknown, deps: DependencyList) {
  const isFirst = useRef(true);
  const prevDeps = useRef(deps);

  useEffect(() => {
    const isSame = prevDeps.current.every((obj, index) => isEqual(obj, deps[index]));

    if (isFirst.current || !isSame) {
      effectFunc();
    }

    isFirst.current = false;
    prevDeps.current = deps;
  }, [ deps, effectFunc ]);
}

export function useNetworkStatus() {
  const [ connectionInfo, setConnectionInfo ] = useState<NetInfoState>({
    isConnected: null,
    isInternetReachable: null,
    type: NetInfoStateType.unknown,
    details: null,
  } as NetInfoUnknownState);
  const [ isLoaded, setIsLoaded ] = useState(false);

  useEffect(() => NetInfo.addEventListener((state) => {
    setConnectionInfo(state);
    setIsLoaded(true);
  }));

  return [ connectionInfo, isLoaded ] as const;
}

export function useCurrentDate(refreshInterval?: number) {
  const [ state, setState ] = useState(new Date());

  useEffect(() => {
    // Set a *refreshInterval* second timer
    const timer = setInterval(() => {
      // Get time components
      setState(new Date());
    }, (refreshInterval ?? 60) * 10);

    return () => {
      clearInterval(timer);
    };
  }, [refreshInterval]);

  return state;
}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

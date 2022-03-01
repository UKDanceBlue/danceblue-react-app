import { getDownloadURL, ref } from 'firebase/storage';
import { DependencyList, useDebugValue, useEffect, useRef, useState } from 'react';
import { isEqual } from 'lodash-es';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { firebaseStorage } from './FirebaseApp';

export function useFirebaseStorageUrl(googleUri: string) {
  useDebugValue(`Storage for ${googleUri}`);

  const [state, setState] = useState<[string | null, Error | null]>([null, null]);

  useEffect(() => {
    if (googleUri) {
      getDownloadURL(ref(firebaseStorage, googleUri))
        .then((url) => {
          setState([url, null]);
        })
        .catch((error) => {
          setState([null, error as Error]);
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
  }, [deps, effectFunc]);
}

export function useCurrentDate(refreshInterval?: number) {
  const [state, setState] = useState(new Date());

  useEffect(() => {
    // Set a *refreshInterval* second timer
    const timer = setInterval(() => {
      // Get time components
      setState(new Date());
    }, (refreshInterval || 60) * 10);

    return () => {
      clearInterval(timer);
    };
  }, [refreshInterval]);

  return state;
}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

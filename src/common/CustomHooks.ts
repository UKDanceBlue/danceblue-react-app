import { getDownloadURL, ref } from 'firebase/storage';
import { useDebugValue, useEffect, useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import * as FileSystem from 'expo-file-system';
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

export function useCachedFile(
  assetId: string,
  freshnessTime: number,
  options: { googleUri?: string; downloadUri?: string; base64?: boolean }
) {
  useDebugValue(`Cache for ${options.googleUri || options.downloadUri || '[NO URI PROVIDED]'}`);

  const [hookState, setHookState] = useState<[string | null, Error | null]>([null, null]);
  const [localUri, setLocalUri] = useState<string | null>(null);

  if (options.googleUri && options.downloadUri) {
    throw new Error('Only one of googleUri or downloadUri may be provided');
  }

  useEffect(() => {
    setLocalUri(`${FileSystem.cacheDirectory}DBFileCache/${encodeURIComponent(assetId)}`);
  }, [assetId]);

  useEffect(() => {
    if ((options.downloadUri || options.googleUri) && localUri) {
      (async () => {
        try {
          // Get information about where the file should be
          const localAssetInfo = await FileSystem.getInfoAsync(localUri);

          // Does the file exist? And if so is it within the threshold for freshness?
          if (
            !localAssetInfo.exists ||
            new Date().getTime() / 1000 - localAssetInfo.modificationTime > freshnessTime
          ) {
            // If not we are going to download the file before reading form it

            // Start by getting figuring out a download uri
            let { downloadUri } = options;
            if (options.googleUri) {
              downloadUri = await getDownloadURL(ref(firebaseStorage, options.googleUri));
            }
            // If there is still no download Uri then throw an error
            if (!downloadUri) {
              throw new Error('No download uri could be determined');
            }

            // Check if the cache directory exists
            const { exists: cacheDirectoryExists } = await FileSystem.getInfoAsync(
              `${FileSystem.cacheDirectory}DBFileCache/`
            );

            // If not, make it
            if (!cacheDirectoryExists) {
              await FileSystem.makeDirectoryAsync(`${FileSystem.cacheDirectory}DBFileCache/`, {
                intermediates: true,
              });
            }

            // Finally we download the file from downloadUri
            await FileSystem.downloadAsync(downloadUri, localUri);
          }
          const localFileContent = await FileSystem.readAsStringAsync(localUri, {
            encoding: options.base64
              ? FileSystem.EncodingType.Base64
              : FileSystem.EncodingType.UTF8,
          });
          if (localFileContent) {
            // Set localFileContent into the hook state, we are done
            setHookState([localFileContent, null]);
          } else {
            throw new Error(`No Content in ${localUri}`);
          }
        } catch (error) {
          setHookState([null, error as Error]);
        }
      })();
    }
  }, [localUri, freshnessTime, options.base64, options]);
  return hookState;
}

export function useCurrentDate(refreshInterval: number) {
  const [state, setState] = useState(new Date());

  useEffect(() => {
    // Set a *refreshInterval* second timer
    const timer = setInterval(() => {
      // Get time components
      setState(new Date());
    }, refreshInterval * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [refreshInterval]);

  return state;
}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

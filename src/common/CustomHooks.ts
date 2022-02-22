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

export type UseCachedFilesType = {
  assetId: string;
  freshnessTime: number;
  googleUri?: string;
  downloadUri?: string;
  base64?: boolean;
};

export function useCachedFiles(
  options: [UseCachedFilesType],
  alwaysReturnArray?: boolean
): [string | null, Error | null];

export function useCachedFiles(
  options: UseCachedFilesType[],
  alwaysReturnArray?: boolean
): [string | null, Error | null][];

export function useCachedFiles(options: any, alwaysReturnArray?: boolean): any {
  const [hookState, setHookState] = useState<
    [string | null, Error | null][] | [string | null, Error | null]
  >([null, null]);
  const [localUris, setLocalUris] = useState<(string | null)[]>([]);

  useEffect(() => {
    const tempLocalUris = Array(options.length).fill('');
    for (let i = 0; i < options.length; i++) {
      tempLocalUris[i] = `${FileSystem.cacheDirectory}DBFileCache/${encodeURIComponent(
        options[i].assetId
      )}`;
    }
    setLocalUris(tempLocalUris);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      let allNeededVariablesSet = true;
      for (let i = 0; i < options.length; i++) {
        if (!((options[i].downloadUri || options[i].googleUri) && localUris[i])) {
          allNeededVariablesSet = false;
          break;
        }
      }

      // Only start loading these if we can do them all at once
      if (allNeededVariablesSet) {
        // Array of promises to get the files
        const fileContentPromises: Promise<[string | null, Error | null]>[] = [];

        for (let i = 0; i < options.length; i++) {
          fileContentPromises.push(
            (async (): Promise<[string | null, Error | null]> => {
              try {
                // Get information about where the file should be
                const localAssetInfo = await FileSystem.getInfoAsync(localUris[i] as string);

                // Does the file exist? And if so is it within the threshold for freshness?
                if (
                  !localAssetInfo.exists ||
                  new Date().getTime() / 1000 - localAssetInfo.modificationTime >
                    options[i].freshnessTime
                ) {
                  // If not we are going to download the file before reading form it

                  // Start by getting figuring out a download uri
                  let { downloadUri } = options[i];
                  if (options[i].googleUri) {
                    downloadUri = await getDownloadURL(ref(firebaseStorage, options[i].googleUri));
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
                    await FileSystem.makeDirectoryAsync(
                      `${FileSystem.cacheDirectory}DBFileCache/`,
                      {
                        intermediates: true,
                      }
                    );
                  }

                  // Finally we download the file from downloadUri
                  await FileSystem.downloadAsync(downloadUri, localUris[i] as string);
                }
                const localFileContent = await FileSystem.readAsStringAsync(
                  localUris[i] as string,
                  {
                    encoding: options[i].base64
                      ? FileSystem.EncodingType.Base64
                      : FileSystem.EncodingType.UTF8,
                  }
                );
                if (localFileContent) {
                  // Set localFileContent into the hook state, we are done
                  return [localFileContent, null];
                } else {
                  throw new Error(`No Content in ${localUris[i]}`);
                }
              } catch (error) {
                return [null, error as Error];
              }
            })()
          );
        }

        await Promise.all(fileContentPromises).then((fileContents) => {
          if (fileContents.length === 1 && !alwaysReturnArray) {
            setHookState(fileContents[0]);
          } else {
            setHookState(fileContents);
          }
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localUris]);

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

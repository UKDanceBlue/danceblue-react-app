import { getDownloadURL, ref } from "firebase/storage";
import { SetStateAction, useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import { Image } from "react-native";
import { firebaseStorage } from "./FirebaseApp";
import { showMessage } from "./AlertUtils";
import { useDeepEffect } from "./CustomHooks";
import store from "../redux/store";

export type UseCachedFilesType = {
  assetId: string;
  freshnessTime: number;
  googleUri?: string;
  downloadUri?: string;
  base64?: boolean;
};

async function getFile(
  localUri: string,
  cacheOption: UseCachedFilesType
): Promise<[string | null, Error | null]> {
  try {
    // Get information about where the file should be
    const localAssetInfo = await FileSystem.getInfoAsync(localUri);

    // Does the file exist? And if so is it within the threshold for freshness?
    if (
      !localAssetInfo.exists ||
      new Date().getTime() / 1000 - localAssetInfo.modificationTime > cacheOption.freshnessTime
    ) {
      if (store.getState().appConfig.offline) {
        return [null, null];
      } else {
        // If the file doesn't exist but we can download it we are going to do so
        // Start by getting figuring out a download uri
        let { downloadUri } = cacheOption;
        if (cacheOption.googleUri) {
          downloadUri = await getDownloadURL(ref(firebaseStorage, cacheOption.googleUri));
        }
        // If there is still no download Uri then throw an error
        if (!downloadUri) {
          throw new Error("No download uri could be determined");
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
    }
    const localFileContent = await FileSystem.readAsStringAsync(localUri, {
      encoding: cacheOption.base64 ? FileSystem.EncodingType.Base64 : FileSystem.EncodingType.UTF8,
    });

    if (localFileContent) {
      // Set localFileContent into the hook state, we are done
      return [localFileContent, null];
    } else {
      throw new Error(`No Content in ${localUri}`);
    }
  } catch (error) {
    return [null, error as Error];
  }
}

export function useCachedFiles(
  options: [UseCachedFilesType],
  alwaysReturnArray?: false
): [string | null, Error | null];

export function useCachedFiles(
  options: UseCachedFilesType[],
  alwaysReturnArray?: boolean
): [string | null, Error | null][];

export function useCachedFiles(options: UseCachedFilesType[], alwaysReturnArray?: boolean) {
  const [hookState, setHookState] = useState<
    [string | null, Error | null][] | [string | null, Error | null]
  >(Array(options.length).fill([null, null]));
  const [localUris, setLocalUris] = useState<(string | null)[]>([]);

  useDeepEffect(() => {
    const tempLocalUris = Array(options.length).fill("");
    for (let i = 0; i < options.length; i++) {
      if (options[i]) {
        tempLocalUris[i] = `${FileSystem.cacheDirectory}DBFileCache/${encodeURIComponent(
          options[i].assetId
        )}`;
      }
    }
    setLocalUris(tempLocalUris);
    // Rule disabled because triggering update on options causes an infinite loop, options.length should be sufficient in most cases
  }, [options]);

  useDeepEffect(() => {
    (async () => {
      let allNeededVariablesSet = true;
      for (let i = 0; i < options.length; i++) {
        if (options[i]) {
          if (!((options[i].downloadUri || options[i].googleUri) && localUris[i])) {
            allNeededVariablesSet = false;
            break;
          }
        }
      }

      // Only start loading these if we can do them all at once
      if (allNeededVariablesSet) {
        // Array of promises to get the files
        const fileContentPromises: Promise<[string | null, Error | null]>[] = [];

        for (let i = 0; i < options.length; i++) {
          if (options[i]) {
            fileContentPromises.push(getFile(localUris[i] as string, options[i]));
          } else {
            // Mark an empty space
            fileContentPromises.push((async () => [null, null])());
          }
        }

        await Promise.all(fileContentPromises)
          .then((fileContents) => {
            if (fileContents.length === 1 && !alwaysReturnArray) {
              setHookState(fileContents[0]);
            } else if (fileContents.length === 0 && alwaysReturnArray) {
              setHookState([]);
            } else {
              setHookState(fileContents);
            }
          })
          .catch(showMessage);
      }
    })();
  }, [alwaysReturnArray, localUris, options]);

  return hookState;
}

export type UseCachedImagesReturnType = {
  imageBase64: string;
  imageWidth: number;
  imageHeight: number;
  imageRatio: number;
};

export function useCachedImages(options: UseCachedFilesType[]) {
  const [hookState, setHookState] = useState<[UseCachedImagesReturnType | null, Error | null][]>(
    Array(options.length).fill([null, null])
  );
  const [imageSizes, setImageSizes] = useState<[number, number][]>(
    Array(options.length).fill([null, null])
  );
  const cachedFiles = useCachedFiles(options, true);

  useEffect(() => {
    // Make an array of promises to try and get dimensions of each image
    const imageSizePromises = cachedFiles.map(
      (element) =>
        new Promise((resolved, rejected) => {
          // For some reason there is a comma at then end of the base64 string?? So this just removes the last character
          Image.getSize(
            `data:image/png;base64,${element}`.slice(0, -1),
            (width, height) => resolved([width, height]),
            rejected
          );
        })
    );

    let shouldUpdateState = true;
    const dontUpdateState = () => {
      shouldUpdateState = false;
    };
    Promise.allSettled(imageSizePromises).then((resolutions) => {
      const tempImageSizes: SetStateAction<[number, number][]> = [];
      resolutions.forEach((resolution, index) => {
        if (resolution.status === "fulfilled") {
          if (Array.isArray(resolution.value)) {
            tempImageSizes[index] = resolution.value as [number, number];
          }
        } else {
          tempImageSizes[index] = resolution.reason;
        }
      });
      if (shouldUpdateState) {
        setImageSizes(tempImageSizes);
      }
    });
    return dontUpdateState;
  }, [cachedFiles]);

  useEffect(() => {
    const tempHookState: [UseCachedImagesReturnType | null, Error | null][] = [];
    for (let i = 0; i < cachedFiles.length; i++) {
      if (cachedFiles[i][1]) {
        tempHookState[i] = [null, cachedFiles[i][1]];
      } else if (imageSizes[i]) {
        const cachedImage = cachedFiles[i];
        if (Array.isArray(imageSizes[i])) {
          const [imageWidth, imageHeight] = imageSizes[i];
          tempHookState[i] = [
            {
              imageBase64: `data:image/png;base64,${cachedImage[0]}`,
              imageWidth,
              imageHeight,
              imageRatio: imageWidth / imageHeight,
            },
            null,
          ];
        } else {
          // If imageSizes[i] is not an array then it must be the reason for the image sizing failing, pass it along
          tempHookState[i] = [null, new Error(imageSizes[i].toString())];
        }
      } else {
        tempHookState[i] = [null, null];
      }
    }
    setHookState(tempHookState);
  }, [cachedFiles, imageSizes]);

  return hookState;
}

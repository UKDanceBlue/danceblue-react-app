import { FirebaseStorageTypes } from "@react-native-firebase/storage";

export interface FirestoreImage {
  uri: `gs://${string}` | `http${"s" | ""}://${string}`;
  width: number;
  height: number;
}

export function isFirestoreImage(image?: object): image is FirestoreImage {
  if (image == null) {
    return false;
  }

  const {
    uri, width, height
  } = image as Partial<FirestoreImage>;
  if (uri == null) {
    return false;
  } else if (typeof uri !== "string") {
    return false;
  } else {
    const [protocol] = uri.split("://");

    if (protocol !== "gs" && protocol !== "http" && protocol !== "https") {
      return false;
    }
  }

  if (width == null) {
    return false;
  } else if (typeof width !== "number") {
    return false;
  } else if (width < 0) {
    return false;
  }

  if (height == null) {
    return false;
  } else if (typeof height !== "number") {
    return false;
  } else if (height < 0) {
    return false;
  }

  return true;
}

export interface DownloadableImage {
  url?: string;
  width: number;
  height: number;
}

export const parseFirestoreImage = async (firestoreImage: FirestoreImage, fbStorage: FirebaseStorageTypes.Module): Promise<DownloadableImage> => ({
  url: firestoreImage.uri.startsWith("gs://") ? await fbStorage.refFromURL(firestoreImage.uri).getDownloadURL().catch(() => undefined) : firestoreImage.uri,
  width: firestoreImage.width,
  height: firestoreImage.height,
});

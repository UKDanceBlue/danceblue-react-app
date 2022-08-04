import { FirebaseStorageTypes } from "@react-native-firebase/storage";

export interface FirestoreImage {
  uri: `gs://${string}` | `http${"s" | ""}://${string}`;
  width: number;
  height: number;
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

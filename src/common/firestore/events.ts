import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirebaseStorageTypes } from "@react-native-firebase/storage";
import { DateTime, Interval } from "luxon";

import { DownloadableImage, FirestoreImage, parseFirestoreImage } from "./commonStructs";

export interface FirestoreEvent {
  title: string;
  description: string;
  image?: FirestoreImage;
  address?: string;
  addressGeoJson?: string;
  startTime?: FirebaseFirestoreTypes.Timestamp;
  endTime?: FirebaseFirestoreTypes.Timestamp;
}

export interface ParsedEvent {
  title: string;
  description: string;
  image?: DownloadableImage;
  address?: string;
  addressGeoJson?: string;
  interval?: ReturnType<Interval["toISO"]>;
}

export const parseFirestoreEvent = async (event: FirestoreEvent, storage: FirebaseStorageTypes.Module): Promise<ParsedEvent> => ({
  title: event.title,
  description: event.description,
  image: event.image != null ? await parseFirestoreImage(event.image, storage) : undefined,
  address: event.address,
  addressGeoJson: event.addressGeoJson,
  interval: Interval.fromDateTimes(DateTime.fromMillis(event.startTime?.toMillis() ?? 0), DateTime.fromMillis(event.endTime?.toMillis() ?? 0)).toISO()
});

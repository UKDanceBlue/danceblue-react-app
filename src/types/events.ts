import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirebaseStorageTypes } from "@react-native-firebase/storage";
import { DateTime, Interval } from "luxon";

import { DownloadableImage, FirestoreImage, isFirestoreImage, parseFirestoreImage } from "./commonStructs";

export interface RawFirestoreEvent {
  title: string;
  description: string;
  image?: FirestoreImage;
  address?: string;
  startTime?: FirebaseFirestoreTypes.Timestamp;
  endTime?: FirebaseFirestoreTypes.Timestamp;
  link?: {
    text: string;
    url: string;
  };
}

export interface ParsedFirestoreEvent {
  title: string;
  description: string;
  image?: DownloadableImage;
  address?: string;
  interval?: ReturnType<Interval["toISO"]>;
  link?: {
    text: string;
    url: string;
  };
}

export function isRawFirestoreEvent(documentData?: object): documentData is RawFirestoreEvent {
  if (documentData == null) {
    return false;
  }

  const {
    title, description, image, address, startTime, endTime, link
  } = documentData as Partial<RawFirestoreEvent>;

  // Check that all required fields are present and of the correct type
  if (title == null) {
    return false;
  } else if (typeof title !== "string") {
    return false;
  }

  if (description == null) {
    return false;
  } else if (typeof description !== "string") {
    return false;
  }

  if (image != null && !(isFirestoreImage(image))) {
    return false;
  }

  if (address != null && typeof address !== "string") {
    return false;
  }

  if (startTime != null && !(startTime instanceof FirebaseFirestoreTypes.Timestamp)) {
    return false;
  }

  if (endTime != null && !(endTime instanceof FirebaseFirestoreTypes.Timestamp)) {
    return false;
  }

  if (link != null) {
    if (typeof link !== "object") {
      return false;
    }

    if ((link as Partial<{
      text: string;
      url: string;
    }>).text == null) {
      return false;
    } else if (typeof link.text !== "string") {
      return false;
    }

    if ((link as Partial<{
      text: string;
      url: string;
    }>).url == null) {
      return false;
    } else if (typeof link.url !== "string") {
      return false;
    }
  }

  return true;
}


export const parseFirestoreEvent = async (event: RawFirestoreEvent, storage: FirebaseStorageTypes.Module): Promise<ParsedFirestoreEvent> => ({
  title: event.title,
  description: event.description,
  image: event.image != null ? await parseFirestoreImage(event.image, storage) : undefined,
  address: event.address,
  interval: Interval.fromDateTimes(DateTime.fromMillis(event.startTime?.toMillis() ?? 0), DateTime.fromMillis(event.endTime?.toMillis() ?? 0)).toISO(),
  link: event.link,
});

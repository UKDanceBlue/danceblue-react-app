import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirebaseStorageTypes } from "@react-native-firebase/storage";
import { DateTime, Interval } from "luxon";

import { DownloadableImage, FirestoreImage, isFirestoreImage, parseFirestoreImage } from "./commonStructs";

export interface RawFirestoreEvent {
  title: string;
  shortDescription?: string;
  description: string;
  image?: FirestoreImage | FirestoreImage[];
  address?: string;
  startTime?: FirebaseFirestoreTypes.Timestamp;
  endTime?: FirebaseFirestoreTypes.Timestamp;
  link?: {
    text: string;
    url: string;
  } | {
    text: string;
    url: string;
  }[];
}

export interface ParsedFirestoreEvent {
  title: string;
  shortDescription?: string;
  description: string;
  image?: DownloadableImage | DownloadableImage[];
  address?: string;
  interval?: ReturnType<Interval["toISO"]>;
  link?: {
    text: string;
    url: string;
  } | {
    text: string;
    url: string;
  }[];
}

export function validateLink(link: unknown): link is {
  text: string;
  url: string;
} {
  const aLink = link as {
    text: string;
    url: string;
  };

  if (typeof aLink !== "object") {
    return false;
  }

  if ((aLink as Partial<{
  text: string;
  url: string;
}>).text == null) {
    return false;
  } else if (typeof aLink.text !== "string") {
    return false;
  }

  if ((aLink as Partial<{
  text: string;
  url: string;
}>).url == null) {
    return false;
  } else if (typeof aLink.url !== "string") {
    return false;
  }

  return true;
}

export function isRawFirestoreEvent(documentData?: object): documentData is RawFirestoreEvent {
  if (documentData == null) {
    return false;
  }

  const {
    title, shortDescription, description, image, address, startTime, endTime, link
  } = documentData as Partial<RawFirestoreEvent>;

  // Check that all required fields are present and of the correct type
  if (title == null) {
    return false;
  } else if (typeof title !== "string") {
    return false;
  }

  if (shortDescription != null && typeof shortDescription !== "string") {
    return false;
  }

  if (description == null) {
    return false;
  } else if (typeof description !== "string") {
    return false;
  }

  if (image != null) {
    if (Array.isArray(image)) {
      if (image.some((img) => !isFirestoreImage(img))) {
        return false;
      }
    } else if (!isFirestoreImage(image)) {
      return false;
    }
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
    if (Array.isArray(link) && !(link.every(validateLink))) {
      return false;
    } else if (!validateLink(link)) {
      return false;
    }
  }

  return true;
}

export const parseFirestoreEvent = async (event: RawFirestoreEvent, storage: FirebaseStorageTypes.Module): Promise<ParsedFirestoreEvent> => ({
  title: event.title,
  shortDescription: event.shortDescription,
  description: event.description,
  image: event.image != null ? (Array.isArray(event.image) ? await Promise.all(event.image.map((image) => parseFirestoreImage(image, storage))) : await parseFirestoreImage(event.image, storage)) : undefined,
  address: event.address,
  interval: Interval.fromDateTimes(DateTime.fromMillis(event.startTime?.toMillis() ?? 0), DateTime.fromMillis(event.endTime?.toMillis() ?? 0)).toISO(),
  link: event.link,
});

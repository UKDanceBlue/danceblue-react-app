import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface FirestoreNotification {
  body: string;
  data?: Record<string, unknown>;
  sendTime: FirebaseFirestoreTypes.Timestamp;
  sound: string;
  title: string;
}

export function isFirestoreNotification(notification?: object): notification is FirestoreNotification {
  if (notification == null) {
    return false;
  }

  const {
    body, data, sendTime, sound, title
  } = notification as Partial<FirestoreNotification>;

  // Check that all required fields are present and of the correct type
  if (body == null) {
    return false;
  } else if (typeof body !== "string") {
    return false;
  }

  if (sendTime == null) {
    return false;
  } else if (!(sendTime instanceof FirebaseFirestoreTypes.Timestamp)) {
    return false;
  }

  if (sound == null) {
    return false;
  } else if (typeof sound !== "string") {
    return false;
  }

  if (title == null) {
    return false;
  } else if (typeof title !== "string") {
    return false;
  }

  if (data != null && typeof data !== "object") {
    return false;
  }

  return true;
}

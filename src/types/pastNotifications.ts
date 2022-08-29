import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface FirestoreNotification {
  body: string;
  data?: Record<string, unknown>;
  sendTime: FirebaseFirestoreTypes.Timestamp;
  sound: string;
  title: string;
}

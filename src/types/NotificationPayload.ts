import { FirestoreImage } from "./commonStructs";

export interface NotificationInfoPopup {
  title: string;
  message: string;
  image?: FirestoreImage;
}

export interface NotificationPayload {
  url: string;
}

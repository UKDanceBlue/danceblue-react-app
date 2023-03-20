import { FirestoreImageJsonV1 } from "@ukdanceblue/db-app-common";

// Found at /marathon/2023/hours/[HOUR NUMBER]
export interface FirestoreHour {
  hourNumber: number;
  hourName: string;
  graphic: FirestoreImageJsonV1;
  content: string;
}

import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirebaseStorageTypes } from "@react-native-firebase/storage";

import { HourInstructionsType, SpecialComponentType } from "./HourScreenTypes";

export type NativeFirebaseError = Parameters<FirebaseStorageTypes.TaskSnapshotObserver["error"]>[0];
export interface FirestoreUser {
  attributes?: Record<string, string>;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  linkblue?: string | null;
  team?: FirebaseFirestoreTypes.DocumentReference | null;
  pastNotifications?: FirebaseFirestoreTypes.DocumentReference[] | null;
}

export interface FirestoreTeam {
  members?: Record<string, string>;
  name: string;
  spiritSpreadsheetId?: string;
  networkForGoodId?: string;
  totalSpiritPoints?: number;
}

export interface FirestoreTeamFundraising {
  total?: number;
}

export type FirestoreTeamIndividualSpiritPoints = Record<string, number>;

export interface FirestoreSponsor {
  link?: string;
  logo?: string;
  name?: string;
}

export interface FirestoreNotification {
  body: string;
  data?: Record<string, unknown>;
  sendTime: FirebaseFirestoreTypes.Timestamp;
  sound: string;
  title: string;
}

export interface FirestoreEvent {
  title: string;
  description: string;
  image?: string;
  address?: string;
  startTime?: FirebaseFirestoreTypes.Timestamp;
  endTime?: FirebaseFirestoreTypes.Timestamp;
}

export interface FirestoreDevice {
  audiences?: string[] | null;
  expoPushToken?: string | null;
  latestUserId?: string | null;
}

export interface FirestoreMobileAppConfig {
  countdown: { time: FirebaseFirestoreTypes.Timestamp; title: string };
  currentTabs: string[];
  scoreboard: {
    pointType: "spirit" | "morale";
    showIcons: boolean;
    showTrophies: boolean;
  };
  demoModeKey: string;
  ssoEnabled: boolean;
}

export interface FirestoreHour {
  hourNumber: number;
  name: string;
  description?: string;
  contentOrder: (
    | "text-instructions"
    | "gs-image"
    | "http-image"
    | "button"
    | "special"
    | "text-block"
    | "photo-upload"
    | "dad-joke-leaderboard"
  )[];
  textInstructions?: HourInstructionsType; // Text-instructions
  firebaseImageUri?: string | string[]; // Gs-image
  imageUri?: string | string[]; // Http-image
  buttonConfig?: { text: string; url: string } | { text: string; url: string }[]; // Button
  specialComponent?: SpecialComponentType | SpecialComponentType[]; // Special
  textBlock?: string | string[];
}

export interface FirestoreMoraleTeam {
  members: Record<string, string>;
  leaders: string;
  teamNumber: number;
  points: number;
}

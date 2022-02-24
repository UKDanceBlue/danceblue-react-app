import { DocumentReference, Timestamp } from 'firebase/firestore';

export interface FirestoreUser {
  attributes?: { [key: string]: string };
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  linkblue?: string | null;
  team?: DocumentReference | null;
  pastNotifications?: DocumentReference[] | null;
}

export interface FirestoreTeam {
  members?: { [key: string]: string };
  name: string;
  spiritSpreadsheetId?: string;
  networkForGoodId?: string;
  totalSpiritPoints?: number;
}

export interface FirestoreTeamFundraising {
  total?: number;
}

export interface FirestoreTeamIndividualSpiritPoints {
  [key: string]: number;
}

export interface FirestoreSponsor {
  link?: string;
  logo?: string;
  name?: string;
}

export interface FirestoreNotification {
  body: string;
  data?: { [key: string]: any };
  sendTime: Timestamp;
  sound: string;
  title: string;
}

export interface FirestoreEvent {
  title: string;
  description: string;
  image?: string;
  address?: string;
  startTime?: Timestamp;
  endTime?: Timestamp;
}

export interface FirestoreDevice {
  audiences?: string[] | null;
  expoPushToken?: string | null;
  latestUserId?: string | null;
}

export interface FirestoreMobileAppConfig {
  countdown: { time: Timestamp; title: string };
  currentTabs: string[];
  scoreboard: {
    pointType: 'spirit' | 'morale';
    showIcons: boolean;
    showTrophies: boolean;
  };
  demoModeKey: string;
}
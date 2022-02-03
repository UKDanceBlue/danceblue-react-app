import { DocumentReference, Timestamp } from 'firebase/firestore';

export type FirestoreUser = {
  attributes?: { [key: string]: string };
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  linkblue?: string | null;
  team?: DocumentReference | null;
  pastNotifications?: DocumentReference[] | null;
};

export type FirestoreTeam = {
  members?: { [key: string]: string };
  name: string;
  spiritSpreadsheetId?: string;
  networkForGoodId?: string;
  totalSpiritPoints?: number;
};

export type FirestoreTeamFundraising = {
  total?: number;
};

export type FirestoreTeamIndividualSpiritPoints = {
  [key: string]: number;
};

export type FirestoreSponsor = {
  link?: string;
  logo?: string;
  name?: string;
};

export type FirestoreNotification = {
  body: string;
  data?: { [key: string]: any };
  sendTime: Timestamp;
  sound: string;
  title: string;
};

export type FirestoreEvent = {
  title: string;
  description: string;
  image?: string;
  address?: string;
  startTime?: Timestamp;
  endTime?: Timestamp;
};

export type FirestoreDevice = {
  audiences?: string[] | null;
  expoPushToken?: string | null;
  latestUserId?: string | null;
};

export type FirestoreMobileAppConfig = {
  countdown: { time: Timestamp; title: string };
  currentTabs: string[];
  scoreboard: {
    pointType: 'spirit' | 'morale';
    showIcons: boolean;
    showTrophies: boolean;
  };
};

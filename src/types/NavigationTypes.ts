/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

import { FirestoreHour } from "./FirebaseTypes";
import { ParsedEvent } from "./events";


export type TabNavigatorParamList = {
  Home: undefined;
  Events: undefined;
  Scoreboard: undefined;
  Team: undefined;
  Marathon: undefined;
  "Scavenger Hunt": undefined;
};

export type TabNavigatorProps<T extends keyof TabNavigatorParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabNavigatorParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type RootStackParamList = {
  Main: undefined;
  SplashLogin: undefined;
  Tab: NavigatorScreenParams<TabNavigatorParamList>;
  Notifications: undefined;
  Profile: undefined;
  Event: {
    event: ParsedEvent;
  };
  "Hour Details": { firestoreHour: FirestoreHour };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }
}

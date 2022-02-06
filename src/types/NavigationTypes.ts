import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { type } from 'os';
import { HourScreenOptionsType } from './HourScreenTypes';

// Navigator param types
export type TabNavigatorParamList = {
  Events: undefined;
  Scoreboard: undefined;
  Team: undefined;
  Marathon: undefined;
  Store: { uri: string } | undefined;
  Donate: { uri: string } | undefined;
  Home: undefined;
  HoursScreen: undefined;
};

export type MainStackParamList = {
  Tab: NavigatorScreenParams<TabNavigatorParamList>;
  Notifications: undefined;
  Profile: undefined;
  Event: {
    id: string;
    name: string;
  };
  'Hour Details': {
    hourName: string;
    hourNumber: number;
    hourScreenOptions: HourScreenOptionsType;
  };
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainStackParamList>;
  SplashLogin: undefined;
  DefaultRoute: { uri: string } | undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>;

export type MainStackScreenProps<T extends keyof MainStackParamList> = CompositeScreenProps<
  StackScreenProps<MainStackParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type TabScreenProps<T extends keyof TabNavigatorParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabNavigatorParamList, T>,
  MainStackScreenProps<keyof MainStackParamList>
>;

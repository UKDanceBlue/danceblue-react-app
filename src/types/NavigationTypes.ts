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
  Tab: undefined;
  Notifications: undefined;
  Profile: undefined;
  Event: {
    name: string;
  };
  'Hour Details': undefined;
};

export type RootStackParamList = {
  Main: undefined;
  SplashLogin: undefined;
  DefaultRoute: { uri: string } | undefined;
};

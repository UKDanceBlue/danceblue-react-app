import { UserLoginType } from "./userDataSlice";

type AppConfigSliceType = {
  enabledScreens: string[];
  countdowns: {
    [key: string]: { millis: number; title: string };
  };
  allowedLoginTypes: UserLoginType[];
  demoModeKey: string;
};

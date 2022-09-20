import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { log, logError, universalCatch } from "../common/logging";
import { useFirebase } from "../context/firebase";

import { useLoading } from "./loading";
import { UserLoginType } from "./user";

interface AppConfiguration {
  isConfigLoaded: boolean;
  enabledScreens: string[];
  allowedLoginTypes: UserLoginType[];
  scoreboardMode: { pointType:string;showIcons:boolean;showTrophies:boolean };
  demoModeKey: string;
}

const initialState: AppConfiguration = {
  isConfigLoaded: false,
  enabledScreens: [],
  allowedLoginTypes: [],
  scoreboardMode: { pointType: "", showIcons: false, showTrophies: false },
  demoModeKey: Math.random().toString(), // Start the demo key as junk for safety's sake
};

const demoModeState: AppConfiguration = {
  ...initialState,
  isConfigLoaded: true,
  enabledScreens: [
    "Events", "Scoreboard", "Team", "MarathonHours"
  ],
  scoreboardMode: initialState.scoreboardMode,
  allowedLoginTypes: [],
};

const AppConfigContext = createContext<[AppConfiguration, ((key: string) => boolean)]>([ initialState, () => false ]);

export const AppConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [ configData, setConfigData ] = useState<AppConfiguration>(initialState);
  const [ , setLoading ] = useLoading();

  const { fbRemoteConfig } = useFirebase();

  const updateState = useCallback(async (): Promise<AppConfiguration> => {
    setLoading(true);
    try {
      await fbRemoteConfig.setDefaults({
        "shown_tabs": "[]",
        "rn_scoreboard_mode": "{\"pointType\":\"spirit\",\"showIcons\":false,\"showTrophies\":true}",
        "login_mode": "[\"ms-oath-linkblue\",\"anonymous\"]",
        "countdowns": "[]",
        "demo_mode_key": "Test Key 8748"
      });
      try {
        await fbRemoteConfig.fetchAndActivate();
      } catch (e) {
        logError(e as Error);
      }
      log("Remote config fetched and activated");

      const remoteConfigData = fbRemoteConfig.getAll();
      const parsedRemoteConfig: Partial<AppConfiguration> = {};

      try {
        parsedRemoteConfig.enabledScreens = (JSON.parse(remoteConfigData.shown_tabs.asString()) ?? undefined) as string[];
      } catch (e) {
        if (e instanceof SyntaxError) {
          log("Error parsing 'shown_tabs'");
          logError(e);
          parsedRemoteConfig.enabledScreens = undefined;
        } else {
          throw e;
        }
      }
      try {
        parsedRemoteConfig.allowedLoginTypes = (JSON.parse(remoteConfigData.login_mode.asString()) as (UserLoginType[] | undefined) ?? undefined);
      } catch (e) {
        if (e instanceof SyntaxError) {
          log("Error while parsing 'login_mode' config");
          logError(e);
          parsedRemoteConfig.allowedLoginTypes = undefined;
        } else {
          throw e;
        }
      }
      parsedRemoteConfig.demoModeKey = remoteConfigData.demo_mode_key.asString() as string | undefined;
      try {
        parsedRemoteConfig.scoreboardMode = (JSON.parse(remoteConfigData.rn_scoreboard_mode.asString()) ?? undefined) as {
        pointType: string;
        showIcons: boolean;
        showTrophies: boolean;
    } | undefined;
      } catch (e) {
        if (e instanceof SyntaxError) {
          log("Error while parsing 'rn_scoreboard_mode' config");
          logError(e);
          parsedRemoteConfig.scoreboardMode = undefined;
        } else {
          throw e;
        }
      }

      return {
        isConfigLoaded: true,
        allowedLoginTypes: parsedRemoteConfig.allowedLoginTypes ?? initialState.allowedLoginTypes,
        enabledScreens: parsedRemoteConfig.enabledScreens ?? initialState.enabledScreens,
        demoModeKey: parsedRemoteConfig.demoModeKey ?? initialState.demoModeKey,
        scoreboardMode: parsedRemoteConfig.scoreboardMode ?? initialState.scoreboardMode,
      };
    } finally {
      setLoading(false);
    }
  }, [ fbRemoteConfig, setLoading ]);

  useEffect(() => {
    updateState().then(setConfigData).catch(universalCatch);
  }, [updateState]);

  const tryToSetDemoMode = useCallback((key: string): boolean => {
    if (key === configData.demoModeKey) {
      setConfigData(demoModeState);
      return true;
    }
    return false;
  }, [configData.demoModeKey]);

  return (
    <AppConfigContext.Provider value={[ configData, tryToSetDemoMode ]}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => {
  return useContext(AppConfigContext)[0];
};

export const useEnterDemoMode = () => {
  const enterDemoMode = useContext(AppConfigContext)[1];
  return enterDemoMode;
};

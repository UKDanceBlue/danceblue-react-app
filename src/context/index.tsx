
import { useCallback } from "react";

import { AuthDataProvider, useEnterDemoMode as useEnterAuthDemoMode } from "./auth";
import { AppConfigProvider, useEnterDemoMode as useEnterConfigDemoMode } from "./config";
import { DeviceDataProvider } from "./device";
import { LoadingWrapper } from "./loading";
import { UserDataProvider } from "./user";

export { useLoading } from "./loading";
export { useAppConfig } from "./config";
export { useAuthData } from "./auth";
export { useUserData } from "./user";
export { useDeviceData } from "./device";

export const useTryToSetDemoMode = (): ((key: string) => boolean) => {
  const tryToSetConfigDemoMode = useEnterConfigDemoMode();
  const setAuthDemoMode = useEnterAuthDemoMode();

  return useCallback((key: string): boolean => {
    if (tryToSetConfigDemoMode(key)) {
      setAuthDemoMode();
      return true;
    } else {
      return false;
    }
  }, [ tryToSetConfigDemoMode, setAuthDemoMode ]);
};


export const CombinedContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <LoadingWrapper>
      <AppConfigProvider>
        <AuthDataProvider>
          <UserDataProvider>
            <DeviceDataProvider>
              {children}
            </DeviceDataProvider>
          </UserDataProvider>
        </AuthDataProvider>
      </AppConfigProvider>
    </LoadingWrapper>
  );
};

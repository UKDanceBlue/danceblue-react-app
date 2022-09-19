
import { useCallback } from "react";

import { AuthDataProvider, useEnterDemoMode as useEnterAuthDemoMode } from "./auth";
import { AppConfigProvider, useEnterDemoMode as useEnterConfigDemoMode } from "./config";
import { LoadingWrapper } from "./loading";

export { useLoading } from "./loading";
export { useAppConfig } from "./config";
export { useAuth } from "./auth";

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
    <AuthDataProvider>
      <AppConfigProvider>
        <LoadingWrapper>
          {children}
        </LoadingWrapper>
      </AppConfigProvider>
    </AuthDataProvider>
  );
};

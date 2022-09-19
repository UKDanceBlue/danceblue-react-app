
import { AuthDataProvider } from "./auth";
import { AppConfigProvider } from "./config";
import { LoadingWrapper } from "./loading";

export { useLoading } from "./loading";
export { useAppConfig, useEnterDemoMode } from "./config";
export { useAuth } from "./auth";

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

import { createContext, useContext, useEffect, useState } from "react";

import { useFirebase } from "../common/FirebaseContext";
import { universalCatch } from "../common/logging";

interface UnloadedAuthData {
  isAuthLoaded: false;
  isLoggedIn: false;
  isAnonymous: false;
  uid: null;
  authClaims: null;
}

interface LoadedAuthData {
  isAuthLoaded: true;
  isLoggedIn: boolean;
  isAnonymous: boolean;
  uid: string | null;
  authClaims: { [key: string]: string | unknown } | null;
}

type AuthData = UnloadedAuthData | LoadedAuthData;

const initialAuthState: AuthData = {
  isAuthLoaded: false,
  isLoggedIn: false,
  isAnonymous: false,
  uid: null,
  authClaims: null,
};

const loggedOutAuthState: AuthData = {
  isAuthLoaded: true,
  isLoggedIn: false,
  isAnonymous: false,
  uid: null,
  authClaims: null,
};

const AuthDataContext = createContext<[AuthData, () => void]>([ initialAuthState, () => undefined ]);

export const AuthDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [ authData, setAuthData ] = useState<AuthData>(initialAuthState);

  const { fbAuth } = useFirebase();

  useEffect(() => {
    const unsubscribe = fbAuth.onAuthStateChanged((user) => {
      (async () => {
        try {
          if (user) {
            const idTokenResult = await user.getIdTokenResult();

            setAuthData({
              isAuthLoaded: true,
              isLoggedIn: true,
              isAnonymous: user.isAnonymous,
              uid: user.uid,
              authClaims: idTokenResult.claims,
            });
          } else {
            setAuthData(loggedOutAuthState);
          }
        } catch (error) {
          universalCatch(error);
          setAuthData(initialAuthState);
        }
      })().catch(universalCatch);
    });

    return unsubscribe;
  }, [fbAuth]);

  const setDemoMode = () => {
    setAuthData({
      ...initialAuthState,
      isAuthLoaded: true,
      isLoggedIn: true,
      uid: "demo"
    });
  };

  return (
    <AuthDataContext.Provider value={[ authData, setDemoMode ]}>
      {children}
    </AuthDataContext.Provider>
  );
};

export const useAuthData = () => {
  return useContext(AuthDataContext)[0];
};

export const useEnterDemoMode = () => {
  return useContext(AuthDataContext)[1];
};

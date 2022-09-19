import { createContext, useContext, useEffect, useState } from "react";

import { useFirebase } from "../common/FirebaseContext";
import { universalCatch } from "../common/logging";

interface AuthData {
  isAuthLoaded: boolean;
  isLoggedIn: boolean;
  isAnonymous: boolean;
  uid: string | null;
  authClaims: { [key: string]: string | unknown } | null;
}

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

const AuthDataContext = createContext<AuthData>(initialAuthState);

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

  return (
    <AuthDataContext.Provider value={authData}>
      {children}
    </AuthDataContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthDataContext);
};

export default useAuth;

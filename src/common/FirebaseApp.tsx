import analytics from "@react-native-firebase/analytics";
import appCheck from "@react-native-firebase/app-check";
import auth from "@react-native-firebase/auth";
import crashlytics from "@react-native-firebase/crashlytics";
import firestore from "@react-native-firebase/firestore";
import functions from "@react-native-firebase/functions";
import remoteConfig from "@react-native-firebase/remote-config";
import storage from "@react-native-firebase/storage";
import { ReactNode, createContext, useContext, useEffect } from "react";

import { login, logout } from "../redux/authSlice";

import { useAppDispatch } from "./CustomHooks";

export const FirebaseContext = createContext({});

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    fbAnalytics: analytics(),
    fbAppCheck: appCheck(),
    fbAuth: auth(),
    fbCrashlytics: crashlytics(),
    fbFirestore: firestore(),
    fbFunctions: functions(),
    fbRemoteConfig: remoteConfig(),
    fbStorage: storage(),
  };

  const dispatch = useAppDispatch();

  useEffect(() => value.fbAuth.onAuthStateChanged((user) => {
    if (user) {
      dispatch(login({ user }));
    } else {
      dispatch(logout());
    }
  }), [
    dispatch, value.fbAuth
  ]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

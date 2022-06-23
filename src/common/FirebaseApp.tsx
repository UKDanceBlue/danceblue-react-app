import analytics, { FirebaseAnalyticsTypes } from "@react-native-firebase/analytics";
import appCheck, { FirebaseAppCheckTypes } from "@react-native-firebase/app-check";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import crashlytics, { FirebaseCrashlyticsTypes } from "@react-native-firebase/crashlytics";
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import functions, { FirebaseFunctionsTypes } from "@react-native-firebase/functions";
import remoteConfig, { FirebaseRemoteConfigTypes } from "@react-native-firebase/remote-config";
import storage, { FirebaseStorageTypes } from "@react-native-firebase/storage";
import { ReactNode, createContext, useContext, useEffect } from "react";

import { logout, syncAuth } from "../redux/authSlice";

import { useAppDispatch } from "./CustomHooks";

const FirebaseContext = createContext<{
  fbAnalytics: FirebaseAnalyticsTypes.Module;
  fbAppCheck: FirebaseAppCheckTypes.Module;
  fbAuth: FirebaseAuthTypes.Module;
  fbCrashlytics: FirebaseCrashlyticsTypes.Module;
  fbFirestore: FirebaseFirestoreTypes.Module;
  fbFunctions: FirebaseFunctionsTypes.Module;
  fbRemoteConfig: FirebaseRemoteConfigTypes.Module;
  fbStorage: FirebaseStorageTypes.Module;
}>({} as never);

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
      dispatch(syncAuth({ user }));
    } else {
      dispatch(logout());
    }
  }), [ dispatch, value.fbAuth ]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

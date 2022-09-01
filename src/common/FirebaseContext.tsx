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
import store from "../redux/store";
import { loadUserData } from "../redux/userDataSlice";

import { useAppDispatch } from "./customHooks";
import { log, universalCatch } from "./logging";

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

  useEffect(() => {
    value.fbAppCheck.activate("THIS STRING IS IGNORED").catch(universalCatch);
  }, [value.fbAppCheck]);

  useEffect(() => value.fbAuth.onAuthStateChanged((user) => {
    log("Auth state changed");
    if (user) {
      dispatch(syncAuth({ user }))
        .then(() => dispatch(loadUserData({ firestore: value.fbFirestore, loginType: user.isAnonymous? "anonymous" : "ms-oath-linkblue", userId: user.uid })))
        .catch(universalCatch);
      value.fbAnalytics.setUserId(user.uid).catch(universalCatch);
      value.fbCrashlytics.setUserId(user.uid).catch(universalCatch);
    } else {
      dispatch(logout());
      value.fbAnalytics.setUserId(null).catch(universalCatch);
      value.fbCrashlytics.setUserId("[LOGGED_OUT]").catch(universalCatch);
    }

    const { uuid } = store.getState().notification;
    if (uuid != null) {
      // Update the user's uid in firestore when auth state changes so long as the uuid has ben initialized
      firestore()
        .doc(`devices/${uuid}`)
        .set({ latestUserId: store.getState().auth.uid }, { merge: true })
        .catch(universalCatch);
    }
  }), [
    dispatch, value.fbAuth, value.fbFirestore, value.fbAnalytics, value.fbCrashlytics, value.fbRemoteConfig
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

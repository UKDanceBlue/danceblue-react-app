import crashlytics from "@react-native-firebase/crashlytics";
import { isError } from "lodash";

import { handleFirebaseError, isFirebaseError } from "./util/AlertUtils";

export function log(message: string | boolean | number | object, level: "info" | "log" | "warn" | "error" = "log") {
  try {
  // eslint-disable-next-line no-console
    const consoleMethod = console[level];
    if (typeof consoleMethod === "function") {
      consoleMethod(message);
    } else {
    // eslint-disable-next-line no-console
      console.log(message);
    }

    if (!__DEV__) {
      if (typeof message === "object") {
        message = JSON.stringify(message, null, 2);
      }
      crashlytics().log(message.toString());
    }
  } catch (error) {
    console.error(error);
  }
}

export function logError(error: Error) {
  try {
    log("JavaScript Error:", "error");
    log(error, "error");

    if (!__DEV__) {
      crashlytics().recordError(error);
    }
  } catch (error) {
    console.error(error);
  }
}

export function universalCatch(error: unknown) {
  try {
    if (isFirebaseError(error)) {
      handleFirebaseError(error);
    } else if (isError(error)) {
      logError(error);
    } else if (typeof error === "string" || typeof error === "number" || typeof error === "boolean" || (typeof error === "object" && error !== null)) {
      log(error, "error");
    } else {
      console.error(error);
    }
  } catch (error) {
    try {
      console.error(error);
    } catch {
      // ignore, we don't want a looping crash
    }
  }
}

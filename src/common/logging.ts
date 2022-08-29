import crashlytics from "@react-native-firebase/crashlytics";
import { isError } from "lodash";

import { NativeFirebaseError } from "../types/firebaseTypes";

export function log(message: string | boolean | number | object, level: "trace" | "debug" | "log" | "info" | "warn" | "error" = "log") {
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

export function isFirebaseError(error: unknown): error is NativeFirebaseError {
  if (typeof error !== "object" || error == null) {
    return false;
  }
  if (typeof (error as NativeFirebaseError).code !== "string") {
    return false;
  }
  if (typeof (error as NativeFirebaseError).message !== "string") {
    return false;
  }
  if (typeof (error as NativeFirebaseError).name !== "string") {
    return false;
  }
  if (typeof (error as NativeFirebaseError).namespace !== "string") {
    return false;
  }
  if (typeof (error as NativeFirebaseError).stack !== "string" && (error as NativeFirebaseError).stack != null) {
    return false;
  }
  if (typeof (error as NativeFirebaseError).cause !== "string" && (error as NativeFirebaseError).cause != null) {
    return false;
  }

  return true;
}

export function universalCatch(error: unknown) {
  try {
    if (isFirebaseError(error)) {
      log(`Error ${error.name}: ${error.code}\n${error.message}`, "error");
      logError(error);
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

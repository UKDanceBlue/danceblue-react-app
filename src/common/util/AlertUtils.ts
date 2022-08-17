import { Alert } from "react-native";

import { NativeFirebaseError } from "../../types/FirebaseTypes";
import { log, logError } from "../logging";

/**
 * Show a one button prompt
 */
export function showMessage(
  message: unknown,
  title = "Error",
  onAccept: () => unknown = () => undefined
) {
  Alert.alert(title.toString(), typeof message === "string" ? message : JSON.stringify(message, undefined, 2), [{ text: "OK", onPress: onAccept }]);

  log(`${title}:\n${typeof message === "string" ? message : JSON.stringify(message, undefined, 2)}`);
}

/**
 * Show a two button prompt that can execute one of two functions depending on the user's selection
 */
export function showPrompt(
  message: string | object,
  title = "Error",
  negativeAction: () => unknown = () => null,
  positiveAction: () => unknown = () => null,
  negativeText = "No",
  positiveText = "Yes"
) {
  Alert.alert(title.toString(), typeof message === "string" ? message : JSON.stringify(message, undefined, 2), [
    { text: negativeText, onPress: negativeAction, style: "cancel" },
    { text: positiveText, onPress: positiveAction },
  ]);

  log(`${title}:\n${typeof message === "string" ? message : JSON.stringify(message, undefined, 2)}`);
}

/**
 * Use showMessage to show a Firebase error code to the user and log the associated error message to stderr
 */
export function handleFirebaseError(error: NativeFirebaseError) {
  showMessage(`Error Code: ${error.code}\n${error.message}`, error.name);
  logError(error);
  return error;
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

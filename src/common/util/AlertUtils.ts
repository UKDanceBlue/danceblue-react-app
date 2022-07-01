import { Alert, Platform } from "react-native";

import { NativeFirebaseError } from "../../types/FirebaseTypes";

function logToFirebase(title: string, message: unknown, logInfo: unknown) {
  try {
    fetch("https://us-central1-react-danceblue.cloudfunctions.net/writeLog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        {
          title,
          message,
          logInfo,
          deviceInfo: {
            os: Platform.OS === "ios" && Platform.isPad ? "iPadOS" : Platform.OS,
            ...Platform.constants,
          },
        },
        undefined,
        "  "
      ),
      // eslint-disable-next-line no-console
    }).then(null, () => console.debug("Failed to upload log to firebase"));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.debug("Failed to upload log to firebase");
  }
}

/**
 * Show a one button prompt
 */
export function showMessage(
  message: unknown,
  title = "Error",
  onAccept: () => unknown = () => undefined,
  log = false,
  logInfo: unknown = ""
) {
  Alert.alert(title.toString(), typeof message === "string" ? message : JSON.stringify(message, undefined, 2), [{ text: "OK", onPress: onAccept }]);

  if (log) {
    // eslint-disable-next-line no-console
    console.log(
      `${title}:\n${JSON.stringify(message, undefined, 2)}\nLog info:\n${JSON.stringify(logInfo, undefined, "  ")}`
    );
    if (!__DEV__) {
      try {
        logToFirebase(title, message, logInfo);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.debug("Failed to upload log to firebase");
      }
    }
  }
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
  positiveText = "Yes",
  log = false,
  logInfo: unknown = ""
) {
  Alert.alert(title.toString(), typeof message === "string" ? message : JSON.stringify(message, undefined, 2), [
    { text: negativeText, onPress: negativeAction, style: "cancel" },
    { text: positiveText, onPress: positiveAction },
  ]);

  if (log) {
    // eslint-disable-next-line no-console
    console.log(
      `${title}:\n${JSON.stringify(message, undefined, 2)}\nLog info:\n${JSON.stringify(logInfo, undefined, "  ")}`
    );
    if (!__DEV__) {
      try {
        logToFirebase(title, message, logInfo);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.debug("Failed to upload log to firebase");
      }
    }
  }
}

/**
 * Use showMessage to show a Firebase error code to the user and log the associated error message to stderr
 */
export function handleFirebaseError(error: NativeFirebaseError, log = false) {
  showMessage(`Error Code: ${error.code}\n${error.message}`, error.name);
  if (log) {
    console.error(error.message);
  }
  if (!__DEV__) {
    try {
      fetch("https://us-central1-react-danceblue.cloudfunctions.net/writeLog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: JSON.stringify(error, undefined, "  "),
          severity: "ERROR",
          deviceInfo: {
            os: Platform.OS === "ios" && Platform.isPad ? "iPadOS" : Platform.OS,
            ...Platform.constants,
          },
        }),
      // eslint-disable-next-line no-console
      }).then(null, () => console.debug("Failed to upload log to firebase"));
    } catch {
      // eslint-disable-next-line no-console
      console.debug("Failed to upload log to firebase");
    }
  }
  return error;
}

import crashlytics from "@react-native-firebase/crashlytics";

export function log(message: string | boolean | number | object, level: "info" | "log" | "warn" | "error" = "log") {
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
}

export function logError(error: Error) {
  log("JavaScript Error:", "error");
  log(error, "error");

  if (!__DEV__) {
    crashlytics().recordError(error);
  }
}

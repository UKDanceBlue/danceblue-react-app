import { FirebaseError } from 'firebase/app';
import { Alert, Platform } from 'react-native';

function logToFirebase(title: string, message: unknown, logInfo: unknown) {
  try {
    fetch('https://us-central1-react-danceblue.cloudfunctions.net/writeLog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          title,
          message,
          logInfo,
          deviceInfo: {
            os: Platform.OS === 'ios' && Platform.isPad ? 'iPadOS' : Platform.OS,
            ...Platform.constants,
          },
        },
        undefined,
        '  '
      ),
    }).then(null, () => console.debug('Failed to upload log to firebase'));
  } catch (error) {
    console.debug('Failed to upload log to firebase');
  }
}

/**
 * Show a one button prompt
 */
export function showMessage(
  message: string | object,
  title = 'Error',
  onAccept: () => unknown = () => {},
  log = false,
  logInfo: unknown = ''
) {
  Alert.alert(title.toString(), message.toString(), [
    { text: 'OK', onPress: onAccept || (() => {}) },
  ]);

  if (log) {
    console.log(
      `${title}:\n${message}\nLog info:\n${
        typeof logInfo === 'object' ? JSON.stringify(logInfo, undefined, '  ') : logInfo
      }`
    );
    if (!__DEV__) {
      try {
        logToFirebase(title, message, logInfo);
      } catch (error) {
        console.debug('Failed to upload log to firebase');
      }
    }
  }
}

/**
 * Show a two button prompt that can execute one of two functions depending on the user's selection
 */
export function showPrompt(
  message: string | object,
  title = 'Error',
  negativeAction: () => unknown = () => {},
  positiveAction: () => unknown = () => {},
  negativeText = 'No',
  positiveText = 'Yes',
  log = false,
  logInfo: unknown = ''
) {
  Alert.alert(title.toString(), message.toString(), [
    { text: negativeText, onPress: negativeAction, style: 'cancel' },
    { text: positiveText, onPress: positiveAction },
  ]);

  if (log) {
    console.log(
      `${title}:\n${message}\nLog info:\n${
        typeof logInfo === 'object' ? JSON.stringify(logInfo, undefined, '  ') : logInfo
      }`
    );
    if (!__DEV__) {
      logToFirebase(title, message, logInfo);
    }
  }
}

/**
 * Use showMessage to show a Firebase error code to the user and log the associated error message to stderr
 */
export function handleFirebaseError(error: FirebaseError, log = false) {
  showMessage(`Error Code: ${error.code}`);
  if (log) {
    console.error(error.message);
  }
  if (!__DEV__) {
    try {
      fetch('https://us-central1-react-danceblue.cloudfunctions.net/writeLog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: JSON.stringify(error, undefined, '  '),
          severity: 'ERROR',
          deviceInfo: {
            os: Platform.OS === 'ios' && Platform.isPad ? 'iPadOS' : Platform.OS,
            ...Platform.constants,
          },
        }),
      }).then(null, () => console.debug('Failed to upload log to firebase'));
    } catch {
      console.debug('Failed to upload log to firebase');
    }
  }
  return error;
}

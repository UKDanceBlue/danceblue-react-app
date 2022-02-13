/* eslint-disable no-console */
import { FirebaseError } from 'firebase/app';
import { Alert } from 'react-native';

/**
 * Show a one button prompt
 */
export function showMessage(
  message: string | any,
  title = 'Error',
  onAccept: () => any = null,
  log = false,
  logInfo: any = ''
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
            },
            undefined,
            '  '
          ),
        }).then(null, () => console.debug('Failed to upload log to firebase'));
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
  message: any,
  title = 'Error',
  negativeAction: () => any = () => {},
  positiveAction: () => any = () => {},
  negativeText = 'No',
  positiveText = 'Yes',
  log = false,
  logInfo: any = ''
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
            },
            undefined,
            '  '
          ),
        }).then(null, () => console.debug('Failed to upload log to firebase'));
      } catch (error) {
        console.debug('Failed to upload log to firebase');
      }
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
        }),
      }).then(null, () => console.debug('Failed to upload log to firebase'));
    } catch {
      console.debug('Failed to upload log to firebase');
    }
  }
  return error;
}

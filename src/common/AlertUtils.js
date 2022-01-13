/* eslint-disable no-console */
import { Alert } from 'react-native';

/**
 * Show a one button prompt
 * @param {string} message A message show in the alert body
 * @param {string} title The alert's title
 * @param {function} onAccept A function run when the user presses OK
 * @param {bool} log Should the alert by logged
 * @param {*} logInfo A string or object to be logged along with the title and message
 */
export function showMessage(message, title = 'Error', onAccept = null, log = false, logInfo = '') {
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
 * @param {string} message
 * @param {string} title
 * @param {function} negativeAction
 * @param {function} positiveAction
 * @param {string} negativeText
 * @param {string} positiveText
 * @param {bool} log Should the alert by logged
 * @param {*} logInfo A string or object to be logged along with the title and message
 */
export function showPrompt(
  message,
  title = 'Error',
  negativeAction = () => {},
  positiveAction = () => {},
  negativeText = 'No',
  positiveText = 'Yes',
  log = false,
  logInfo = ''
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
 * @param {object} error
 * @param {string} log
 * @returns the error that was passed for chaining
 */
export function handleFirebaeError(error, log = false) {
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
        body: { message: JSON.stringify(error, undefined, '  '), severity: 'ERROR' },
      }).then(null, () => console.debug('Failed to upload log to firebase'));
    } catch {
      console.debug('Failed to upload log to firebase');
    }
  }
  return error;
}

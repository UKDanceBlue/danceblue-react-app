/* eslint-disable no-console */
import { Alert } from 'react-native';

/**
 * Show a one button prompt that can execute a function when the user presses 'OK'
 * @param {string} message
 * @param {string} title
 * @param {function} action
 */
export function showMessage(message, title = 'Error', action = () => {}) {
  Alert.alert(title, message, [{ text: 'OK', onPress: action }]);
}

/**
 * Show a two button prompt that can execute one of two functions depending on the user's selection
 * @param {string} errorMessage
 * @param {string} title
 * @param {function} negativeAction
 * @param {function} positiveAction
 * @param {string} negativeText
 * @param {string} positiveText
 */
export function showPrompt(
  errorMessage,
  title = 'Error',
  negativeAction = () => {},
  positiveAction = () => {},
  negativeText = 'No',
  positiveText = 'Yes'
) {
  Alert.alert(title, errorMessage, [
    { text: negativeText, onPress: negativeAction, style: 'cancel' },
    { text: positiveText, onPress: positiveAction },
  ]);
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
  return error;
}

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { signOut, SAMLAuthProvider } from 'firebase/auth';
import { handleFirebaeError, showMessage } from './AlertUtils';
import { firebaseAuth } from './FirebaseApp';
import { loginSaml } from '../redux/authSlice';
import store from '../redux/store';

export default class SingleSignOn {
  constructor() {
    this.backendUrl = 'https://app.danceblue.org/saml-relay.html';
  }

  /**
   * Authenticate a user using SSO by opening the native browser and navigating to the IDP
   * This is acomplished through the use of a dummy page that signs the user in using methods
   * unavailable in React Native, and then passing the auth credential back to the app in
   * the query string of the expo-linking url
   * @param {String} operation The authentication operation to be performed **MUST BE HANDLED BY THE SERVER**
   * @returns {UserCredential} The signed in UserCredential or undefined if the operation fails or is cancelled
   */
  async authenticate(operation) {
    try {
      // Open a browser that goes to backendUrl and passes the desired operation, firebase config, and a link back to the app
      const result = await WebBrowser.openAuthSessionAsync(
        `${this.backendUrl}?linkingUri=${Linking.createURL(`/${operation}`)}`
      ).catch((reason) => {
        showMessage(reason, 'Error with web browser');
        return {};
      });
      switch (result.type) {
        case WebBrowser.WebBrowserResultType.CANCEL:
        case WebBrowser.WebBrowserResultType.DISMISS:
        case WebBrowser.WebBrowserResultType.LOCKED:
          showMessage('Sign in cancelled', 'Browser closed');
          break;
        case 'success':
          if (result?.url) {
            this.redirectData = Linking.parse(result.url);
          }
          break;
        case null:
        case undefined:
          showMessage('Browser did not respond.\nSign in failed', 'No response', true);
          return;
        default:
          showMessage(
            `Browser responded with type ${result.type}`,
            'Unexpected response',
            undefined,
            true,
            result
          );
          break;
      }
      if (result.url) {
        this.redirectData = Linking.parse(result.url);
      }
    } catch (error) {
      showMessage(error, 'Error with web browser');
      return;
    }

    if (!this.redirectData) {
      showMessage(
        'Browser did not respond or sign in was cancelled.\nSign in failed',
        'No response',
        true
      );
      return;
    }

    const credentials = SAMLAuthProvider.credentialFromJSON(
      JSON.parse(this.redirectData.queryParams.credential)
    );

    // This is only used here because we are about to sign in again // TODO: replace with https://firebase.google.com/docs/auth/web/anonymous-auth#convert-an-anonymous-account-to-a-permanent-account
    if (firebaseAuth.currentUser && firebaseAuth.currentUser.isAnonymous) {
      signOut(firebaseAuth)
        .catch(handleFirebaeError)
        .then(() => {
          store.dispatch(loginSaml(credentials));
        });
    }
  }
}

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import {
  SAMLAuthProvider,
  linkWithCredential,
  signInWithCredential,
  signOut,
  UserCredential,
} from 'firebase/auth';
import { showMessage } from './AlertUtils';
import { firebaseAuth } from './FirebaseApp';
import { loginSaml } from '../redux/authSlice';
import store from '../redux/store';

let browserOpen = false;
export default class SingleSignOn {
  backendUrl: string;
  redirectData: Linking.ParsedURL;
  constructor() {
    this.backendUrl = 'https://app.danceblue.org/saml-relay.html';
  }

  /**
   * Authenticate a user using SSO by opening the native browser and navigating to the IDP
   * This is accomplished through the use of a dummy page that signs the user in using methods
   * unavailable in React Native, and then passing the auth credential back to the app in
   * the query string of the expo-linking url
   */
  async authenticate(operation: string): Promise<UserCredential> {
    if (browserOpen) {
      return;
    }
    try {
      browserOpen = true;
      // Open a browser that goes to backendUrl and passes the desired operation, firebase config, and a link back to the app
      const result = await WebBrowser.openAuthSessionAsync(
        `${this.backendUrl}?linkingUri=${Linking.createURL(`/${operation}`)}`,
        undefined
      )
        .catch((reason) => {
          showMessage(reason, 'Error with web browser');
        })
        .finally(() => {
          browserOpen = false;
        });
      if (typeof result === 'object') {
        switch (result?.type) {
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
            showMessage('Browser did not respond.\nSign in failed', 'No response', undefined, true);
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
      }
    } catch (error) {
      showMessage(error, 'Error with web browser');
      return;
    }

    if (!this.redirectData) {
      showMessage(
        'Browser did not respond or sign in was cancelled.\nSign in failed',
        'No response',
        undefined,
        true
      );
      return;
    }

    const credentials = SAMLAuthProvider.credentialFromJSON(
      JSON.parse(this.redirectData.queryParams.credential)
    );

    // This is only used here because we are about to sign in again // TODO: replace with https://firebase.google.com/docs/auth/web/anonymous-auth#convert-an-anonymous-account-to-a-permanent-account
    if (firebaseAuth.currentUser && firebaseAuth.currentUser.isAnonymous) {
      linkWithCredential(firebaseAuth.currentUser, credentials)
        .then((userCredential) => {
          store.dispatch(loginSaml(userCredential));
        })
        .catch(async () => {
          showMessage(
            'The data from your anonymous account could not be transferred to your SSO account. Sign in was successful.',
            'Problem transferring data'
          );
          await signOut(firebaseAuth);
          store.dispatch(loginSaml(await signInWithCredential(firebaseAuth, credentials)));
        });
    } else {
      store.dispatch(loginSaml(await signInWithCredential(firebaseAuth, credentials)));
    }
  }
}

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import {
  getAdditionalUserInfo,
  updateProfile,
  signOut,
  SAMLAuthProvider,
  signInWithCredential,
  signInAnonymously,
} from 'firebase/auth';
import { handleFirebaeError, showMessage } from './AlertUtils';
import { setUserData } from '../firebase/FirebaseUtils';
import { firebaseFirestore, firebaseAuth } from '../firebase/FirebaseApp';

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
        `${this.backendUrl}?linkingUri=${Linking.makeUrl(`/${operation}`)}`
      ).catch((reason) => {
        throw new Error(reason.toString());
      });
      switch (result.type) {
        case WebBrowser.WebBrowserResultType.CANCEL:
        case WebBrowser.WebBrowserResultType.DISMISS:
        case WebBrowser.WebBrowserResultType.LOCKED:
          showMessage('Sign in cancelled', 'Browser closed');
          return undefined;
        case 'success':
          if (result?.url) {
            this.redirectData = Linking.parse(result.url);
          }
          break;
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
      return undefined;
    }

    if (firebaseAuth.currentUser && firebaseAuth.currentUser.isAnonymous) {
      signOut(firebaseAuth).catch(handleFirebaeError);
    }

    if (!this.redirectData) {
      showMessage(
        'Browser did not respond or sign in was cancelled.\nSign in failed',
        'No response',
        true
      );
      return undefined;
    }

    const credentials = SAMLAuthProvider.credentialFromJSON(
      JSON.parse(this.redirectData.queryParams.credential)
    );
    return signInWithCredential(firebaseAuth, credentials)
      .then((userCredential) => {
        // Make sure firebase sent a profile option
        const additionalInfo = getAdditionalUserInfo(userCredential);
        if (!additionalInfo?.profile || !userCredential?.user?.email) {
          // If it didn't then tell the user, sign out, and log a message including the complete userCredential
          showMessage(
            'Required information not recieved\nSign in failed',
            'Invalid server response',
            () => {
              signOut(firebaseAuth).catch(handleFirebaeError);
              signInAnonymously(firebaseAuth).catch(handleFirebaeError);
            },
            true,
            userCredential
          );
          return undefined;
        }

        if (additionalInfo.providerId === 'saml.danceblue-firebase-linkblue-saml') {
          setUserData(
            firebaseFirestore,
            userCredential.user.uid,
            additionalInfo.profile['first-name'],
            additionalInfo.profile['last-name'],
            additionalInfo.profile.email,
            userCredential.user.email.substring(0, userCredential.user.email.indexOf('@'))
          ).catch(handleFirebaeError);
          updateProfile(userCredential.user, {
            displayName: additionalInfo.profile['display-name'],
          }).catch(handleFirebaeError);
        }
        return userCredential;
      })
      .catch(handleFirebaeError);
  }
}

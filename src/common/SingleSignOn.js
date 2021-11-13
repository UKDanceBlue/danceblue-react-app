import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { firebaseConfig } from '../firebase/FirebaseContext';
import { handleFirebaeError, showMessage } from './AlertUtils';
import FirebaseFirestoreWrappers from '../firebase/FirebaseFirestoreWrappers';
import FirebaseAuthWrappers from '../firebase/FirebaseAuthWrappers';

export default class SingleSignOn {
  constructor(firebaseAuthWrapper, firebaseFirestoreWrapper) {
    this.firebaseApiKey = firebaseConfig.apiKey;
    this.firebaseAuthDomain = firebaseConfig.authDomain;
    this.firebaseAuthWrapper = firebaseAuthWrapper;
    this.firebaseFirestoreWrapper = firebaseFirestoreWrapper;

    this.backendUrl = 'https://www.danceblue.org/firebase-wrapper-app.html';
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
        `${this.backendUrl}?linkingUri=${Linking.makeUrl(`/${operation}`)}&apiKey=${
          this.firebaseApiKey
        }&authDomain=${this.firebaseAuthDomain}`
      ).catch(showMessage('failed to open login page'));
      if (result.url) {
        this.redirectData = Linking.parse(result.url);
      }
    } catch (error) {
      showMessage(error);
      return undefined;
    }

    return this.firebaseAuthWrapper
      .loginWithCredentialJSON(this.redirectData.queryParams.credential)
      .then((userCredential) => {
        // Make sure firebase sent a profile option
        const profile = userCredential?.additionalUserInfo?.profile;
        if (!profile) {
          // If it didn't then tell the user, sign out, and log a message including the complete userCredential
          showMessage(
            'Profile not recieved\nSign in failed',
            'Invalid server response',
            FirebaseAuthWrappers.signOut,
            true,
            userCredential
          );
        }

        FirebaseFirestoreWrappers.setUserFirestoreDoc(
          {
            linkblue: profile['name-id'],
            displayName: profile['display-name'],
            firstName: profile['first-name'],
            lastName: profile['last-name'],
            email: profile.email,
          },
          userCredential.user.uid
        );
      })
      .catch(handleFirebaeError);
  }
}

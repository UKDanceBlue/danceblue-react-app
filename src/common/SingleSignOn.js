import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { firebaseConfig } from '../firebase/FirebaseContext';
import { handleFirebaeError, showMessage } from './AlertUtils';

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
      const result = await WebBrowser.openAuthSessionAsync(
        `${this.backendUrl}?linkingUri=${Linking.makeUrl(`/${operation}`)}&apiKey=${
          this.firebaseApiKey
        }&authDomain=${this.firebaseAuthDomain}`
      ).catch(() => showMessage('failed to open login page'));
      if (result.url) {
        this.redirectData = Linking.parse(result.url);
      }
    } catch (error) {
      showMessage(error);
      return undefined;
    }

    // if (this.firebaseAuthWrapper.getAuthUserInstance()) {
    //   if (!this.firebaseAuthWrapper.getAuthUserInstance().isAnonomous) {
    //     //If the user is logged in but not anonomous don't try and sign them in again, just return undefined
    //     alert('Error: Invalid login state for SSO\nCancelling');
    //     return undefined;
    //   }
    //   this.firebaseAuthWrapper
    //     .linkCurrentUserWithCredentialJSON(
    //       // If the user is anonomous, link the anonomous credential with the SSO credential
    //       this.redirectData.queryParams.credential
    //     )
    //     .then((uCredential) => (userCredential = uCredential));
    // } else {
    return this.firebaseAuthWrapper
      .loginWithCredentialJSON(
        // If the user is not signed in at all, then sign them in with SSO
        this.redirectData.queryParams.credential
      )
      .then((userCredential) => {
        userCredential.user
          .updateProfile({
            displayName: userCredential?.additionalUserInfo?.profile['display-name'],
          })
          .catch(handleFirebaeError);
      })
      .catch(handleFirebaeError);
    // }
  }
}
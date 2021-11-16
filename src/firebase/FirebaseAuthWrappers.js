import {
  initializeAuth,
  onAuthStateChanged,
  linkWithCredential,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInAnonymously,
  signInWithCredential,
  SAMLAuthProvider,
} from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseApp } from './FirebaseContext';

export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Keep an up to date currentUser reference available
let { currentUser } = auth;
onAuthStateChanged(auth, (newUser) => {
  currentUser = newUser;
});

const FirebaseAuthWrappers = {
  /**
   * Links the signed in user (likley anonymous) with the given email and password
   *
   * Likley to produce an error code due to bad input, **shoud be followed by a .catch()**
   * @param {string} email User's email
   * @param {string} password User's password
   * @returns A promise for the User's credentials that resolves when Firebase finishes the changes
   * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.User#linkwithcredential linkWithCredential}
   * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.auth#usercredential UserCredential}
   * @function
   * @author Kenton Carrier
   * @since 1.0.1
   */
  linkAnon: (email, password) => {
    const credentials = EmailAuthProvider.credential(email, password);
    return linkWithCredential(currentUser, credentials);
  },
  /**
   * Send a reauthentication request to firebse
   *
   * Could produce an error code if the given detals are outdated, **shoud be followed by a .catch()**
   * @param {string} email User's email
   * @param {string} password User's password
   * @returns A promise for the User's credentials that resolves when Firebase
   * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.User#reauthenticatewithcredential reauthenticateWithCredential}
   * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.auth#usercredential UserCredential}
   * @function
   * @author Kenton Carrier
   * @since 1.0.1
   */
  reauthenticateWithEmail: (email, password) => {
    const credentials = EmailAuthProvider.credential(email, password);
    return reauthenticateWithCredential(currentUser, credentials);
  },
  /**
   * Login a user using email/passowrd authentication
   *
   * Likley to produce an error code due to bad input, **shoud be followed by a .catch()**
   * @param {string} email User's email
   * @param {string} password User's password
   * @returns A promise for a user credential that resolves when the authentication completes or fails
   * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithemailandpassword signinwithemailandpassword}
   * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.auth#usercredential UserCredential}
   * @function
   */
  loginWithEmail: (email, password) => signInWithEmailAndPassword(auth, email, password),
  /**
   * Signup a user using email/password authentication
   *
   * Likley to produce an error code due to bad input, **shoud be followed by a .catch()**
   * @param {string} email User's email
   * @param {string} password User's password
   * @returns A promise for a user credential that resolves when the authentication completes or fails
   * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#createuserwithemailandpassword createuserwithemailandpassword}
   * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.auth#usercredential UserCredential}
   * @function
   */
  signupWithEmail: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  /**
   * Signs out the user
   * @returns A promise that resolves once the signout is complete
   * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signout signOut}
   * @function
   */
  signOut: () => signOut(auth),
  /**
   * Adds an observer for changes to the user's sign-in state.
   * @param {function} observer An observer function
   * @param {function} onError A function called on error
   * @param {function} onCompleted A function called when the listener is removed
   * @returns A callback which can be invoked to remove the observer
   * @see {@link hhttps://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#onauthstatechanged onauthstatechanged}
   * @function
   */
  checkAuthUser: (observer, onError, onCompleted) =>
    onAuthStateChanged(auth, observer, onError, onCompleted),
  /**
   * Gets the currently signed in user from Firebase
   * @returns The currently signed in user
   * @function
   */
  getAuthUserInstance: () => currentUser,
  /**
   * Asynchronously signs in as an anonymous user.
   * @returns A promise for a user credential
   * If there is already an anonymous user signed in, that user will be returned;
   * otherwise, a new anonymous user identity will be created and returned.
   * @function
   * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinanonymously signinanonymously}
   * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.auth#usercredential UserCredential}
   */
  signInAnon: () => signInAnonymously(),
  /**
   * Signs a user in using a pre-existing auth credential
   * @param {String} credential The AuthCredential, obtained from another sign in method in a JSON string
   * @returns {UserCredential} The authenticated user's user credential
   */
  loginWithCredentialJSON: (jsonCredential) => {
    const credentials = SAMLAuthProvider.credentialFromJSON(JSON.parse(jsonCredential));
    return signInWithCredential(auth, credentials);
  },
  /**
   * Links the currently signed in user's account with the given credential
   * This function is mostly for upgrading an anonomous account
   * @param {String} credential The AuthCredential, obtained from another sign in method in a JSON string
   * @returns {UserCredential} The authenticated user's user credential
   */
  linkCurrentUserWithCredentialJSON: (jsonCredential) => {
    const credentials = SAMLAuthProvider.credentialFromJSON(JSON.parse(jsonCredential));
    return linkWithCredential(currentUser, credentials);
  },
  /**
   * Signs a user in using a pre-existing auth credential
   * @param {String} credential The AuthCredential, obtained from another sign in method in a JSON string
   * @returns {UserCredential} The authenticated user's user credential
   */
  reauthenticateWithCredentialJSON: (jsonCredential) => {
    const credentials = SAMLAuthProvider.credentialFromJSON(JSON.parse(jsonCredential));
    return reauthenticateWithCredential(currentUser, credentials);
  },
};

export default FirebaseAuthWrappers;

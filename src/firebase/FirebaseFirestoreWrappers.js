import firebase from 'firebase';
import 'firebase/auth';

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
    const credentials = firebase.auth.EmailAuthProvider.credential(email, password);
    return firebase.auth().currentUser.linkWithCredential(credentials);
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
    const credentials = firebase.auth.EmailAuthProvider.credential(email, password);
    return firebase.auth().currentUser.reauthenticateWithCredential(credentials);
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
   * @author Kenton Carrier
   * @since 1.0.1
   */
  loginWithEmail: (email, password) => firebase.auth().signInWithEmailAndPassword(email, password),
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
   * @author Kenton Carrier
   * @since 1.0.1
   */
  signupWithEmail: (email, password) =>
    firebase.auth().createUserWithEmailAndPassword(email, password),
  /**
   * Signs out the user
   * @returns A promise that resolves once the signout is complete
   * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signout signOut}
   * @function
   * @author Kenton Carrier
   * @since 1.0.1
   */
  signOut: () => firebase.auth().signOut(),
  /**
   * Adds an observer for changes to the user's sign-in state.
   * @param {function} user An observer function
   * @returns A callback which can be invoked to remove the observer
   * @see {@link hhttps://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#onauthstatechanged onauthstatechanged}
   * @function
   * @author Kenton Carrier
   * @since 1.0.1
   */
  checkAuthUser: (user) => firebase.auth().onAuthStateChanged(user),
  /**
   * Gets the currently signed in user from Firebase
   * @returns The currently signed in user
   * @function
   * @author Kenton Carrier
   * @since 1.0.1
   */
  getAuthUserInstance: () => firebase.auth().currentUser,
  /**
   * Asynchronously signs in as an anonymous user.
   * @returns A promise for a user credential
   * If there is already an anonymous user signed in, that user will be returned;
   * otherwise, a new anonymous user identity will be created and returned.
   * @function
   * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinanonymously signinanonymously}
   * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.auth#usercredential UserCredential}
   * @author Kenton Carrier
   * @since 1.0.1
   */
  signInAnon: () => firebase.auth().signInAnonymously(),
  /**
   * Signs a user in using a pre-existing auth credential
   * @param {String} credential The AuthCredential, obtained from another sign in method in a JSON string
   * @returns {UserCredential} The authenticated user's user credential
   * @author Tag Howard
   * @since 1.1.0
   */
  loginWithCredentialJSON: (credential) =>
    firebase
      .auth()
      .signInWithCredential(firebase.auth.AuthCredential.fromJSON(JSON.parse(credential))),
  /**
   * Links the currently signed in user's account with the given credential
   * This function is mostly for upgrading an anonomous account
   * @param {String} credential The AuthCredential, obtained from another sign in method in a JSON string
   * @returns
   * @author Tag Howard
   * @since 1.1.0
   */
  linkCurrentUserWithCredentialJSON: (credential) =>
    firebase
      .auth()
      .currentUser.linkWithCredential(
        firebase.auth.AuthCredential.fromJSON(JSON.parse(credential))
      ),
  /**
   * Signs a user in using a pre-existing auth credential
   * @param {String} credential The AuthCredential, obtained from another sign in method in a JSON string
   * @returns {UserCredential} The authenticated user's user credential
   * @author Tag Howard
   * @since 1.1.0
   */
  reauthenticateWithCredentialJSON: (credential) =>
    firebase
      .auth()
      .currentUser.reauthenticateWithCredential(
        firebase.auth.AuthCredential.fromJSON(JSON.parse(credential))
      ),
};

export default FirebaseAuthWrappers;

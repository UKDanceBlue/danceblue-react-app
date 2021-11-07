import firebase from 'firebase'
import 'firebase/auth'

const FirebaseAuthWrappers = {
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
    loginWithEmail: (email, password) => {
      return firebase.auth().signInWithEmailAndPassword(email, password)
    },
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
    signupWithEmail: (email, password) => {
      return firebase.auth().createUserWithEmailAndPassword(email, password)
    },
    /**
     * Signs out the user
     * @returns A promise that resolves once the signout is complete
     * @see {@link https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signout signOut}
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    signOut: () => {
      return firebase.auth().signOut()
    },
    /**
     * Adds an observer for changes to the user's sign-in state.
     * @param {function} user An observer function
     * @returns A callback which can be invoked to remove the observer
     * @see {@link hhttps://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#onauthstatechanged onauthstatechanged}
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    checkAuthUser: (user) => {
      return firebase.auth().onAuthStateChanged(user)
    },
    /**
     * Gets the currently signed in user from Firebase
     * @returns The currently signed in user
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    getAuthUserInstance: () => {
      return firebase.auth().currentUser
    },
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
    signInAnon: () => {
      return firebase.auth().signInAnonymously()
    }
}
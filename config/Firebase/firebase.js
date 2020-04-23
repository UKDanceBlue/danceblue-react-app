import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

firebase.initializeApp(firebaseConfig);

const Firebase = {
  // auth
  loginWithEmail: (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  },
  signupWithEmail: (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  },
  signOut: () => {
    return firebase.auth().signOut();
  },
  checkAuthUser: user => {
    return firebase.auth().onAuthStateChanged(user);
  },
  // firestore
  createNewUser: userData => {
    return firebase
      .firestore()
      .collection("users")
      .doc(`${userData.uid}`)
      .set(userData);
  },
  getTeams: () => {
    return firebase
      .firestore()
      .collection("teams")
      .get();
  },
  getSponsors: () => {
    return firebase
      .firestore()
      .collection("sponsors")
      .get();
  },
  // cloud storage
  getDocumentRef: path => {
    return firebase.storage().ref(path);
  }
};

export default Firebase;

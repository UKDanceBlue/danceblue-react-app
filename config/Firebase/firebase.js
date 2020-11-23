import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

firebase.initializeApp(firebaseConfig);

const Firebase = {
    // authentication things
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


    // firestore queries
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
    getActiveCountdown: () => {
        return firebase
            .firestore()
            .collection("countdowns")
            .where("active", "==", true)
            .get();
    },
    getAnnouncements: () => {
        return firebase
            .firestore()
            .collection("announcements")
            .where("endDate", ">=", (new Date()))
            .orderBy("endDate")
            .get();
    },

    // cloud storage
    getDocumentURL: (path) => {
        return firebase
            .storage()
            .ref(path)
            .getDownloadURL();
    },


    //user stuff
    readUser: userid => {
        return firebase
            .firestore()
            .collection("users")
            .where("uid", "==", userid)
            .get();
    },
    // This can be used to pull team information based on user's team.
    getTeam: team => {
        return firebase
            .firestore()
            .collection("teams")
            .where("number", "==", team)
            .get();
    },

    createNewUser: userData => {
        return firebase
            .firestore()
            .collection("users")
            .doc(`${userData.uid}`)
            .set(userData);
    },

    // This function can be updated if we choose to let users update their profiles themselves from app.
    updateUser: userData => {
        return firebase
            .firestore()
            .collection("users")
            .doc(`${userData.uid}`)
            .set(userData);
    }
};

export default Firebase;
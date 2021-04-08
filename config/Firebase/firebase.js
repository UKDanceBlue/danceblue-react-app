import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import firebaseConfig from './firebaseConfig'

firebase.initializeApp(firebaseConfig)

const Firebase = {
  // auth
  loginWithEmail: (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  },
  signupWithEmail: (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
  },
  signOut: () => {
    return firebase.auth().signOut()
  },
  checkAuthUser: (user) => {
    return firebase.auth().onAuthStateChanged(user)
  },
  // firestore
  createNewUser: userData => {
    return firebase
      .firestore()
      .collection('users')
      .doc(`${userData.uid}`)
      .set(userData)
  },
  getTeams: () => {
    return firebase
      .firestore()
      .collection('teams')
      .get()
  },
  getSponsors: () => {
    return firebase
      .firestore()
      .collection('sponsors')
      .get()
  },
  getActiveCountdown: () => {
    return firebase
      .firestore()
      .collection('countdowns')
      .where('active', '==', true)
      .get()
  },
  getAnnouncements: () => {
    return firebase
      .firestore()
      .collection('announcements')
      .get()
  },
  getUsers: () => {
    return firebase
      .firestore()
      .collection('users')
      .get()
  },
  getUsersWithPoints: () => {
    return firebase
      .firestore()
      .collection('users')
      .where('points', '!=', null)
      .get()
  },
  getEvents: () => {
    return firebase
      .firestore()
      .collection('events')
      .get()
  },
  getEvent: (id) => {
    return firebase
      .firestore()
      .collection('events')
      .doc(id)
      .get()
  },
  getUpcomingEvents: () => {
    const now = new Date()
    return firebase
      .firestore()
      .collection('events')
      .where('endTime', '>', now)
      .get()
  },
  getUser: (userId) => {
    return firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .get()
  },
  // This can be used to pull team information based on user's team.
  getTeam: (teamId) => {
    return firebase
      .firestore()
      .collection('teams')
      .where('number', '==', teamId)
      .get()
  },
  // cloud storage
  getDocumentURL: path => {
    return firebase
      .storage()
      .ref(path)
      .getDownloadURL()
  },
  getConfig: () => {
    return firebase
      .firestore()
      .collection('configs')
      .doc('mobile-app')
      .get()
  },
  getUserBadges: (userID) => {
    return firebase
      .firestore()
      .collection('users')
      .doc(userID)
      .collection('badges')
      .get()
  },
  addPushToken: (token) => {
    let dbRef = firebase.firestore().collection('expo-push-tokens')
    return dbRef.get().then(snapshot => {
      let found = false
      snapshot.forEach(doc => {
        if (doc.data().token === token) found = true
      })
      if (found === false) {
        return dbRef.add({
          token: token
        })
      }
    })
  }
}

export default Firebase

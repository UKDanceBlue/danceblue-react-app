import firebase from 'firebase'
import 'firebase/firestore'

const Firebase = {
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
      var credentials = firebase.auth.EmailAuthProvider.credential(email, password)
      return firebase.auth().currentUser.linkWithCredential(credentials)
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
    reauthenticate: (email, password) => {
      var credentials = firebase.auth.EmailAuthProvider.credential(email, password)
      return firebase.auth().currentUser.reauthenticateWithCredential(credentials)
    },
    /**
     * Add a new document describing a user the *users* collection in Firebase
     * 
     * Likley to produce an error code due to bad input, **shoud be followed by a .catch()**
     * @param {map} userData Dealis of the user (e.g. name, email)
     * @param {string} id User ID
     * @returns A promise that resolves once the data is written
     * @see {@link https://firebase.google.com Firebase}
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    createNewUser: (userData, id) => {
      return firebase
        .firestore()
        .collection('users')
        .doc(id)
        .set(userData)
    },
    /**
     * Get all teams in Firebase
     * @returns A promise containing a collection of teams
     * @see {@link https://firebase.google.com Firebase}
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    getTeams: () => {
      return firebase
        .firestore()
        .collection('teams')
        .get()
    },
    /**
     * Get the sponsors listed in Firebase
     * @returns A promise containing a collection of the requested sponsors
     * @see {@link https://firebase.google.com Firebase}
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    getSponsors: () => {
      return firebase
        .firestore()
        .collection('sponsors')
        .get()
    },
    /**
     * Get a list of any active ocuntdowns
     * @returns A promise containing a collection the requested countdowns
     * @see {@link https://firebase.google.com Firebase}
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    getActiveCountdown: () => {
      return firebase
        .firestore()
        .collection('countdowns')
        .where('active', '==', true)
        .get()
    },
    /**
     * Gets all the annoucnemnets in Firebase
     * @returns A promise containing the requested announcemnts
     * @see {@link https://firebase.google.com Firebase}
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    getAnnouncements: () => {
      return firebase
        .firestore()
        .collection('announcements')
        .get()
    },
    /**
     * Get all users in Firebase
     * @returns A promise containing a collection of users
     * @see {@link https://firebase.google.com Firebase}
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    getUsers: () => {
      return firebase
        .firestore()
        .collection('users')
        .get()
    },
    /**
     * Get all users who have points
     * @returns A promise containing a collection of the requested users
     * @see {@link https://firebase.google.com Firebase}
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    getUsersWithPoints: () => {
      return firebase
        .firestore()
        .collection('users')
        .where('points', '!=', null)
        .get()
    },
    /**
     * Get all events from Firebase
     * @returns A promise containing a collection of the requested users
     * @see {@link https://firebase.google.com Firebase}
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    getEvents: () => {
      return firebase
        .firestore()
        .collection('events')
        .get()
    },
    /**
     * Get a particualr event from Firebase
     * @param {string} id The event's Firebase ID
     * @returns A promise containg the a collection of the requested events
     * @see {@link https://firebase.google.com Firebase}
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    getEvent: (id) => {
      return firebase
        .firestore()
        .collection('events')
        .doc(id)
        .get()
    },
    /**
     * Get events whose *endTime* is after the current date/time
     * @returns A promise containg the a collection of the requested events
     * @see {@link https://firebase.google.com Firebase}
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    getUpcomingEvents: () => {
      const now = new Date()
      return firebase
        .firestore()
        .collection('events')
        .where('endTime', '>', now)
        .get()
    },
    /**
     * Get the specified user
     * @param {string} userId The user's UUID
     * @returns A promise containing a collection with the requested user(s)
     * @see {@link https://firebase.google.com Firebase}
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    getUser: (userId) => {
      return firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .get()
    },
    /**
     * Get the specified team from Firebase
     * This can be used to pull team information based on user's team.
     * @param {string} teamId The team's Firebase ID
     * @returns A promise contiang a collection with the requested team(s)
     * @see {@link https://firebase.google.com Firebase}
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    getTeam: (teamId) => {
      return firebase
        .firestore()
        .collection('teams')
        .where('number', '==', teamId)
        .get()
    },
    /**
     * Get current configs from Firebase
     * @returns A promise containing the requested data
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    getConfig: () => {
      return firebase
        .firestore()
        .collection('configs')
        .doc('mobile-app')
        .get()
    },
    /**
     * Get a user's badges
     * @param {string} userID The user's UUID
     * @returns A promise contiang a collection of the requested user's badges
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
    getUserBadges: (userID) => {
      return firebase
        .firestore()
        .collection('users')
        .doc(userID)
        .collection('badges')
        .get()
    },
    /**
     * Load an expo push notification token into Firebase
     * @param {string} token The Expo push token generated by *Notifications.getExpoPushTokenAsync()*
     * @returns A promise for the new document in Firebase
     * @see {@link https://docs.expo.dev/push-notifications/push-notifications-setup/ Expo notifications documentation}
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
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
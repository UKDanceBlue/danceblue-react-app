import firebase from 'firebase'
import firebaseConfig from './FirebaseConfig'

firebase.initializeApp(firebaseConfig)

const FirebaseCoreWrappers = {
    /**
     * Get a file from Firebae cloud storage
     * @param {string} path The path of the file in cloud storage
     * @returns A promise for the download URL for the requested file
     * @function
     * @author Kenton Carrier
     * @since 1.0.1
     */
     getDocumentURL: path => {
        return firebase
          .storage()
          .ref(path)
          .getDownloadURL()
      },
}
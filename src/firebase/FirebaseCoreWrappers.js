import firebase from 'firebase';

const FirebaseCoreWrappers = {
  /**
   * Get a file from Firebae cloud storage
   * @param {string} path The path of the file in cloud storage
   * @returns A promise for the download URL for the requested file
   * @function
   */
  getDocumentURL: (path) => firebase.storage().ref(path).getDownloadURL(),
};

export default FirebaseCoreWrappers;

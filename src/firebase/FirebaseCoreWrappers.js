import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from './FirebaseContext';

const storage = getStorage(firebaseApp);

const FirebaseCoreWrappers = {
  /**
   * Get a file from Firebae cloud storage
   * @param {string} path The path of the file in cloud storage
   * @returns A promise for the download URL for the requested file
   * @function
   */
  getDocumentURL: (path) => getDownloadURL(ref(storage, path)),
};

export default FirebaseCoreWrappers;

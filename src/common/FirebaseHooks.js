import { getDownloadURL, ref } from 'firebase/storage';
import { useDebugValue, useEffect, useState } from 'react';
import { firebaseStorage } from './FirebaseApp';

// eslint-disable-next-line import/prefer-default-export
export function useFirebaseStorageUrl(googleUri) {
  useDebugValue(`Storage for ${googleUri}`);

  const [state, setState] = useState([null, null]);

  useEffect(() => {
    if (googleUri) {
      getDownloadURL(ref(firebaseStorage, googleUri))
        .then((url) => {
          setState([url, null]);
        })
        .catch((error) => {
          setState([null, error]);
        });
    }
  }, [googleUri]);

  return state;
}

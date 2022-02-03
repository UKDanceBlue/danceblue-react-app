import { getDownloadURL, ref } from 'firebase/storage';
import { useDebugValue, useEffect, useState } from 'react';
import { firebaseStorage } from './FirebaseApp';

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

export function useCurrentDate(refreshInterval) {
  const [state, setState] = useState(new Date());

  useEffect(() => {
    // 1 second timer
    const timer = setInterval(() => {
      // Get time components
      setState(new Date());
    }, refreshInterval * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [refreshInterval]);

  return state;
}

import { initializeAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Initialize firebase, called when Firebase imports this file
export const firebaseConfig = {
  apiKey: 'AIzaSyDIOW4mnUoM568wgxQP9MOtP6-vLZZruy8',
  authDomain: 'react-danceblue.firebaseapp.com',
  databaseURL: 'https://react-danceblue.firebaseio.com',
  projectId: 'react-danceblue',
  storageBucket: 'react-danceblue.appspot.com',
  messagingSenderId: '480114538491',
  appId: '1:480114538491:web:2d534667a63c9867a2bd5e',
  measurementId: 'G-BP0CDEHW3B',
};

const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const firebaseFirestore = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);

export default firebaseApp;

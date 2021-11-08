import React, { createContext } from 'react';
import firebase from 'firebase';

//Initialize firebase, called when Firebase imports this file
const firebaseConfig = {
  apiKey: 'AIzaSyDIOW4mnUoM568wgxQP9MOtP6-vLZZruy8',
  authDomain: 'react-danceblue.firebaseapp.com',
  databaseURL: 'https://react-danceblue.firebaseio.com',
  projectId: 'react-danceblue',
  storageBucket: 'react-danceblue.appspot.com',
  messagingSenderId: '480114538491',
  appId: '1:480114538491:web:2d534667a63c9867a2bd5e',
  measurementId: 'G-BP0CDEHW3B',
};
firebase.initializeApp(firebaseConfig);

const FirebaseContext = createContext({});

export const FirebaseProvider = FirebaseContext.Provider;
export const FirebaseConsumer = FirebaseContext.Consumer;

/**
 * The snippet for creating the context and a high order function. The HoC will eliminate the need for importing and using Firebase.
 * Wrapping each component as a parameter to the HoC will provide access to Firebase queries (or the custom methods created in file Firebase.js) as props.
 * @see {@link https://heartbeat.comet.ml/upload-images-in-react-native-apps-using-firebase-and-firestore-297934c9bae8#:~:text=the%20below%20snippet%3A-,Using%20the%20Context%20API,-Using%20the%20Context The article Kenton got this from}
 * @param {Component} Component
 * @returns a component wrapped in a Firebaseconsumer that should add a firebase prop
 * @author Kenton Carrier
 * @since 1.0.1
 */
export const withFirebaseHOC = (Component) => (props) =>
  (
    <FirebaseConsumer>
      {(value) => (
        <Component
          {...props}
          firebase={value['firestore']}
          auth={value['auth']}
          core={value['core']}
        />
      )}
    </FirebaseConsumer>
  );

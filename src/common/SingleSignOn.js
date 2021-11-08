import React, { useState } from 'react';
import { View, Button, LogBox, StyleSheet, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { firebaseConfig } from '../firebase/FirebaseContext';

export default class SingleSignOn {
  constructor(firebaseAuthWrapper, firebaseFirestoreWrapper) {
    this.firebaseApiKey = firebaseConfig.apiKey;
    this.firebaseAuthDomain = firebaseConfig.authDomain;
    this.firebaseAuthWrapper = firebaseAuthWrapper;
    this.firebaseFirestoreWrapper = firebaseFirestoreWrapper;

    this.backendUrl = 'https://www.danceblue.org/firebase-wrapper-app.html';
  }

  /**
   * Authenticate a user using SSO by opening the native browser and navigating to the IDP
   * This is acomplished through the use of a dummy page that signs the user in using methods
   * unavailable in React Native, and then passing the auth credential back to the app in
   * the query string of the expo-linking url
   * @param {String} operation The authentication operation to be performed **MUST BE HANDLED BY THE SERVER**
   * @returns {UserCredential} The signed in UserCredential or null if the operation fails or is cancelled
   */
  async authenticate(operation) {
    try {
      let result = await WebBrowser.openAuthSessionAsync(
        this.backendUrl +
          `?linkingUri=${Linking.makeUrl('/' + operation)}&apiKey=${
            this.firebaseApiKey
          }&authDomain=${this.firebaseAuthDomain}`
      );
      if (result.url) {
        this.redirectData = Linking.parse(result.url);
      }
    } catch (error) {
      alert(error);
      console.log(error);
      return null;
    }

    if (!this.redirectData) {
      return null;
    }

    let userCredential;

    // if (this.firebaseAuthWrapper.getAuthUserInstance()) {
    //   if (!this.firebaseAuthWrapper.getAuthUserInstance().isAnonomous) {
    //     //If the user is logged in but not anonomous don't try and sign them in again, just return null
    //     alert('Error: Invalid login state for SSO\nCancelling');
    //     return null;
    //   }
    //   this.firebaseAuthWrapper
    //     .linkCurrentUserWithCredentialJSON(
    //       // If the user is anonomous, link the anonomous credential with the SSO credential
    //       this.redirectData.queryParams.credential
    //     )
    //     .then((uCredential) => (userCredential = uCredential));
    // } else {
    this.firebaseAuthWrapper
      .loginWithCredentialJSON(
        //If the user is not signed in at all, then sign them in with SSO
        this.redirectData.queryParams.credential
      )
      .then((userCredential) => {
        console.log(userCredential.additionalUserInfo + '\n\n\n');
        console.log(userCredential.additionalUserInfo.profile);
        console.log(userCredential.additionalUserInfo.profile['displayName']);
        console.log(userCredential.additionalUserInfo.profile.displayName);
        userCredential.user.updateProfile({
          displayName: userCredential.additionalUserInfo.profile.displayName,
        });
        console.log(userCredential.user.displayName);
      });
    // }
  }
}

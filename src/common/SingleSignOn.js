import React, { useState } from 'react';
import { View, Button, LogBox, StyleSheet, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

import firebase from 'firebase';

export default class SingleSignOn {
  constructor(firebaseApiKey, firebaseAuthDomain, firebaseAuth) {
    this.firebaseApiKey = firebaseApiKey;
    this.firebaseAuthDomain = firebaseAuthDomain;
    this.firebaseAuth = firebaseAuth;

    this.backendUrl = 'https://www.danceblue.org/firebase-wrapper-app.html';
  }

  async authenticate(operation, action) {
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
    }

    if (!this.redirectData) {
      return;
    }

    return this.firebaseAuth.signInWithCredential(
      firebase.auth.AuthCredential.fromJSON(JSON.parse(this.redirectData.queryParams.credential))
    );
  }
}

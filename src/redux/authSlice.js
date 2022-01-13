/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAdditionalUserInfo,
  signInAnonymously,
  signInWithCredential,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { showMessage } from '../common/AlertUtils';
import { firebaseAuth, firebaseFirestore } from '../common/FirebaseApp';

const initialState = {
  isAuthLoaded: false,
  isLoggedIn: false,
  isAnononmous: false,
  uid: null,
  firstName: null,
  lastName: null,
  email: null,
  linkblue: null,
  displayName: null,
  team: null,
  teamIndividualSpiritPoints: null,
  teamFundraisingTotal: null,
};

export const logout = createAsyncThunk('auth/logout', async () => signOut(firebaseAuth));

export const loginAnon = createAsyncThunk('auth/loginAnon', async () =>
  signInAnonymously(firebaseAuth)
);

export const loginSaml = createAsyncThunk('auth/loginSaml', async (credential, thunkApi) => {
  const userCredential = await signInWithCredential(firebaseAuth, credential);
  // Make sure firebase sent a profile option
  const additionalInfo = getAdditionalUserInfo(userCredential);

  // Make sure this is the provider we think it is
  if (!(additionalInfo?.providerId === 'saml.danceblue-firebase-linkblue-saml')) {
    return thunkApi.rejectWithValue({ error: 'UNEXPECTED_AUTH_PROVIDER' });
  }

  // Make sure we got a profile and email
  if (!additionalInfo?.profile || !userCredential?.user?.email) {
    return thunkApi.rejectWithValue({ error: 'INVALID_SERVER_RESPONSE' });
  }

  const userInfo = {
    uid: userCredential.user.uid,
    firstName: additionalInfo.profile['first-name'] || null,
    lastName: additionalInfo.profile['last-name'] || null,
    email: additionalInfo.profile.email,
    linkblue: userCredential.user.email.endsWith('@uky.edu')
      ? userCredential.user.email.substring(0, userCredential.user.email.indexOf('@'))
      : null,
    displayName: additionalInfo.profile['display-name'] || null,
    team: null,
    teamIndividualSpiritPoints: null,
    teamFundraisingTotal: null,
  };

  // Upload SAML info to firebase
  setDoc(
    doc(firebaseFirestore, 'users', userCredential.user.uid),
    {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      linkblue: userCredential.user.email.substring(0, userCredential.user.email.indexOf('@')),
    },
    { merge: true }
  );
  updateProfile(userCredential.user, {
    displayName: additionalInfo.profile['display-name'] || null,
  });

  // Get information about the user's team
  const userSnapshot = await getDoc(doc(firebaseFirestore, 'users', userCredential.user.uid));
  if (userSnapshot.team) {
    // Go ahead and set up some collection references
    const teamConfidentialRef = collection(
      firebaseFirestore,
      `${userSnapshot.team.path}/confidential`
    );

    const teamPromiseResponses = await Promise.allSettled([
      getDoc(userSnapshot.team),
      getDoc(doc(teamConfidentialRef, 'individualSpiritPoints')),
      getDoc(doc(teamConfidentialRef, 'fundraising')),
    ]);

    if (teamPromiseResponses[0].status === 'fulfilled')
      userInfo.team = teamPromiseResponses[0].value;
    if (teamPromiseResponses[1].status === 'fulfilled')
      userInfo.team = teamPromiseResponses[1].teamIndividualSpiritPoints;
    if (teamPromiseResponses[2].status === 'fulfilled')
      userInfo.team = teamPromiseResponses[2].teamFundraisingTotal;
  }

  // Fufill the thunk with the info we collected
  return thunkApi.fulfillWithValue(userInfo);
});

// Redux Toolkit allows us to write "mutating" logic in reducers. It
// doesn't actually mutate the state because it uses the Immer library,
// which detects changes to a "draft state" and produces a brand new
// immutable state based off those changes
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout.pending, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthLoaded = true;
        state.isLoggedIn = false;
        state.isAnononmous = false;
        state.uid = null;
        state.team = null;
        state.teamIndividualSpiritPoints = null;
        state.teamFundraisingTotal = null;
        state.firstName = null;
        state.lastName = null;
        state.email = null;
        state.linkblue = null;
        state.displayName = null;
      })
      .addCase(loginAnon.pending, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(loginAnon.fulfilled, (state) => {
        state.isAuthLoaded = true;
        state.isLoggedIn = true;
        state.isAnononmous = true;
        state.uid = null;
        state.team = null;
        state.teamIndividualSpiritPoints = null;
        state.teamFundraisingTotal = null;
        state.firstName = null;
        state.lastName = null;
        state.email = null;
        state.linkblue = null;
        state.displayName = null;
      })
      .addCase(loginSaml.pending, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(loginSaml.fulfilled, (state, action) => {
        state.isAuthLoaded = true;
        state.isLoggedIn = true;
        state.uid = action.payload.payload.uid;
        state.team = action.payload.payload.team;
        state.teamIndividualSpiritPoints = action.payload.payload.teamIndividualSpiritPoints;
        state.teamFundraisingTotal = action.payload.payload.teamFundraisingTotal;
        state.firstName = action.payload.payload.firstName;
        state.lastName = action.payload.payload.lastName;
        state.email = action.payload.payload.email;
        state.linkblue = action.payload.payload.linkblue;
        state.displayName = action.payload.payload.displayName;
      })
      .addCase(loginSaml.rejected, (state, action) => {
        if (action.error.message === 'Rejected') {
          switch (action?.payload?.error) {
            case 'UNEXPECTED_AUTH_PROVIDER':
              showMessage(
                'DanceBlue Mobile recieved an unrecognized response from the login server. Did you log into a website other than UK?',
                'Login Server Error',
                () => {},
                true,
                action
              );
              break;
            case 'INVALID_SERVER_RESPONSE':
              showMessage(
                'DanceBlue Mobile recieved an invalid response from the login server. Try again later.',
                'Login Server Error',
                () => {},
                true,
                action
              );
              break;
            default:
              showMessage(
                'DanceBlue Mobile ran into an unexpected issue with the login server. This is a bug, please report it to the DanceBlue committee.',
                'Login Server Error',
                () => {},
                true,
                action
              );
          }
        } else {
          showMessage(action.error.message, action.error.code, null, true, action.error.stack);
        }
      });
  },
});

export default authSlice.reducer;

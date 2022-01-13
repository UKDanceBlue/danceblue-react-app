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
  attributes: {},
  firstName: null,
  lastName: null,
  email: null,
  linkblue: null,
  displayName: null,
  teamId: null,
  team: null,
  teamIndividualSpiritPoints: null,
  teamFundraisingTotal: null,
};

export const logout = createAsyncThunk('auth/logout', async (arg, thunkApi) =>
  signOut(firebaseAuth).then(() => {
    setDoc(
      doc(firebaseFirestore, 'devices', thunkApi.getState().notification.uuid),
      {
        latestUserId: null,
        audiences: ['all'],
      },
      { mergeFields: ['latestUserId', 'audiences'] }
    );
  })
);

export const syncAuthDataWithUser = createAsyncThunk(
  'auth/syncAuthDataWithUser',
  async (user, thunkApi) => {
    const userInfo = {
      uid: null,
      attributes: {},
      firstName: null,
      lastName: null,
      email: null,
      linkblue: null,
      displayName: null,
      teamId: null,
      team: null,
      teamIndividualSpiritPoints: null,
      teamFundraisingTotal: null,
    };
    if (user && !user.isAnononmous) {
      userInfo.uid = user.uid;
      userInfo.displayName = user.displayName;

      // Get information about the user's team
      const userSnapshot = await getDoc(doc(firebaseFirestore, 'users', user.uid));

      // !!! copy all fields in firebase to userInfo !!!
      const firebaseUserData = userSnapshot.data();
      Object.assign(userInfo, firebaseUserData);

      if (userSnapshot.get('team')) {
        userInfo.teamId = userSnapshot.get('team').id;

        // Go ahead and set up some collection references
        const teamConfidentialRef = collection(
          firebaseFirestore,
          `${userSnapshot.get('team').path}/confidential`
        );

        const teamPromiseResponses = await Promise.allSettled([
          getDoc(userSnapshot.get('team')),
          getDoc(doc(teamConfidentialRef, 'individualSpiritPoints')),
          getDoc(doc(teamConfidentialRef, 'fundraising')),
        ]);

        if (teamPromiseResponses[0].status === 'fulfilled')
          userInfo.team = teamPromiseResponses[0].value.data();
        if (teamPromiseResponses[1].status === 'fulfilled')
          userInfo.teamIndividualSpiritPoints = teamPromiseResponses[1].value.data();
        if (teamPromiseResponses[2].status === 'fulfilled')
          userInfo.teamFundraisingTotal = teamPromiseResponses[2].value.data();
      }
    }
    // Fufill the thunk with any info we collected
    return thunkApi.fulfillWithValue(userInfo);
  }
);

export const loginAnon = createAsyncThunk('auth/loginAnon', async (arg, thunkApi) =>
  signInAnonymously(firebaseAuth).then(() => {
    setDoc(
      doc(firebaseFirestore, 'devices', thunkApi.getState().notification.uuid),
      {
        latestUserId: null,
        audiences: ['all'],
      },
      { mergeFields: ['latestUserId', 'audiences'] }
    );
  })
);

export const loginSaml = createAsyncThunk('auth/loginSaml', async (credential, thunkApi) => {
  // 1. Sign in
  const userCredential = await signInWithCredential(firebaseAuth, credential);

  // 2. Do some verificaton
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

  // 3. Set up an object to be filled with data and then returned
  const userInfo = {
    uid: userCredential.user.uid,
    attributes: {},
    firstName: additionalInfo.profile['first-name'] || null,
    lastName: additionalInfo.profile['last-name'] || null,
    email: additionalInfo.profile.email,
    linkblue: userCredential.user.email.endsWith('@uky.edu')
      ? userCredential.user.email.substring(0, userCredential.user.email.indexOf('@'))
      : null,
    displayName: additionalInfo.profile['display-name'] || null,
    teamId: null,
    team: null,
    teamIndividualSpiritPoints: null,
    teamFundraisingTotal: null,
  };

  // 4. Upload SAML info to firebase
  await setDoc(
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

  // 5. Get the user's firebase document and add it's information to userInfo
  const userSnapshot = await getDoc(doc(firebaseFirestore, 'users', userCredential.user.uid));
  // !!! copy all fields in firebase to userInfo !!!
  const firebaseUserData = userSnapshot.data();
  delete firebaseUserData.team;
  Object.assign(userInfo, firebaseUserData);

  // 6. Get information about the user's team (if any)
  if (userSnapshot.get('team')) {
    userInfo.teamId = userSnapshot.get('team').id;

    // Go ahead and set up some collection references
    const teamConfidentialRef = collection(
      firebaseFirestore,
      `${userSnapshot.get('team').path}/confidential`
    );

    const teamPromiseResponses = await Promise.allSettled([
      getDoc(userSnapshot.get('team')),
      getDoc(doc(teamConfidentialRef, 'individualSpiritPoints')),
      getDoc(doc(teamConfidentialRef, 'fundraising')),
    ]);

    if (teamPromiseResponses[0].status === 'fulfilled')
      userInfo.team = teamPromiseResponses[0].value.data();
    if (teamPromiseResponses[1].status === 'fulfilled')
      userInfo.teamIndividualSpiritPoints = teamPromiseResponses[1].value.data();
    if (teamPromiseResponses[2].status === 'fulfilled')
      userInfo.teamFundraisingTotal = teamPromiseResponses[2].value.data();
  }

  // 7. Update the uid and audience data in this device's firebase document
  const audiences = ['all'];
  if (
    typeof userInfo.attributes === 'object' &&
    !Array.isArray(userInfo.attributes) &&
    userInfo.attributes !== null &&
    Object.keys(userInfo.attributes).length > 0
  ) {
    // Grab the user's attributes
    const attributeNames = Object.keys(userInfo.attributes);
    const audiencePromises = [];

    // Add any attributes with isAudience to the audiences array
    for (let i = 0; i < attributeNames.length; i++) {
      audiencePromises.push(getDoc(doc(firebaseFirestore, 'valid-attributes', attributeNames[i])));
    }
    await Promise.all(audiencePromises).then((audienceDocs) => {
      for (let i = 0; i < audienceDocs.length; i++) {
        const attributeData = audienceDocs[i].data();
        const attributeName = audienceDocs[i].ref.id;
        const userAttributeValue = userInfo.attributes[attributeName];
        if (attributeData[userAttributeValue].isAudience) {
          audiences.push(userAttributeValue);
        }
      }
    });
  }

  // If the user is on a team, add the team ID as an audience
  if (userInfo.teamId) {
    audiences.push(userInfo.teamId);
  }

  // Set the uid and audiences in firebase
  await setDoc(
    doc(firebaseFirestore, 'devices', thunkApi.getState().notification.uuid),
    {
      latestUserId: userInfo.uid || null,
      audiences,
    },
    { mergeFields: ['latestUserId', 'audiences'] }
  );

  // 8. Fufill the thunk with the info we collected
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
        state.attributes = {};
        state.teamId = null;
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
        state.attributes = {};
        state.teamId = null;
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
        state.uid = action.payload.uid;
        state.attributes = action.payload.attributes;
        state.teamId = action.payload.teamId;
        state.team = action.payload.team;
        state.teamIndividualSpiritPoints = action.payload.teamIndividualSpiritPoints;
        state.teamFundraisingTotal = action.payload.teamFundraisingTotal;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.linkblue = action.payload.linkblue;
        state.displayName = action.payload.displayName;
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
      })

      .addCase(syncAuthDataWithUser.pending, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(syncAuthDataWithUser.fulfilled, (state, action) => {
        state.isAuthLoaded = true;
        state.isLoggedIn = !!action.payload.uid;
        state.uid = action.payload.uid;
        state.attributes = action.payload.attributes;
        state.teamId = action.payload.teamId;
        state.team = action.payload.team;
        state.teamIndividualSpiritPoints = action.payload.teamIndividualSpiritPoints;
        state.teamFundraisingTotal = action.payload.teamFundraisingTotal;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.linkblue = action.payload.linkblue;
        state.displayName = action.payload.displayName;
      })
      .addCase(syncAuthDataWithUser.rejected, (state, action) => {
        if (action.error.message === 'Rejected') {
          showMessage(action.error.message, action.error.code, null, true, action.error.stack);
        }
      });
  },
});

export default authSlice.reducer;

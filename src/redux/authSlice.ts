/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAdditionalUserInfo,
  signInAnonymously,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import {
  collection,
  doc,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { showMessage } from '../common/AlertUtils';
import { firebaseAuth, firebaseFirestore } from '../common/FirebaseApp';
import {
  FirestoreTeam,
  FirestoreTeamFundraising,
  FirestoreTeamIndividualSpiritPoints,
  FirestoreUser,
} from '../types/FirebaseTypes';

type AuthSliceType = {
  isAuthLoaded: boolean;
  isLoggedIn: boolean;
  isAnonymous: boolean;
  uid: string | null;
  attributes: { [key: string]: string };
  pastNotifications: string[];
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  linkblue: string | null;
  teamId: string | null;
  team: FirestoreTeam | null;
  teamIndividualSpiritPoints: FirestoreTeamIndividualSpiritPoints | null;
  teamFundraisingTotal: FirestoreTeamFundraising | null;
};

const initialState: AuthSliceType = {
  isAuthLoaded: false,
  isLoggedIn: false,
  isAnonymous: false,
  uid: null,
  attributes: {},
  pastNotifications: [],
  firstName: null,
  lastName: null,
  email: null,
  linkblue: null,
  teamId: null,
  team: null,
  teamIndividualSpiritPoints: null,
  teamFundraisingTotal: null,
};

// !!!START OF ACTION DEFINITIONS!!!

export const updateUserData = createAsyncThunk(
  'auth/updateUserData',
  async (newUser: { userSnapshot: DocumentSnapshot; isAnonymous: boolean }) => {
    const { userSnapshot, isAnonymous } = newUser;

    const userInfo: Partial<AuthSliceType> = {
      uid: null,
      isLoggedIn: !!userSnapshot,
      isAnonymous,
      attributes: {},
      pastNotifications: [],
      firstName: null,
      lastName: null,
      email: null,
      linkblue: null,
      teamId: null,
      team: null,
      teamIndividualSpiritPoints: null,
      teamFundraisingTotal: null,
    };

    const firebaseUserData = userSnapshot?.data() as FirestoreUser;
    // If the firebaseUserData is falsy, skip processing the data and just pass along the base userInfo object
    if (firebaseUserData) {
      // Don't add non-serializable reference to teams
      delete firebaseUserData.team;

      // !!! copy all fields in firebase to userInfo !!!
      userInfo.uid = userSnapshot.id;
      Object.assign(userInfo, firebaseUserData);

      // Map the non-serializable array of references to past notifications to an array of path strings
      if (Array.isArray(userSnapshot.get('pastNotifications'))) {
        userInfo.pastNotifications = userSnapshot
          .get('pastNotifications')
          .map((reference: DocumentReference) => reference.path);
      }

      let teamReference: DocumentReference;
      let preloadedTeamSnapshot: DocumentSnapshot;
      // Get information about the user's team (if any)
      if (userSnapshot.get('team')) {
        teamReference = userSnapshot.get('team');
      } else if (userInfo.linkblue) {
        const teamsCollectionRef = collection(firebaseFirestore, 'teams');
        const teamQuery = query(
          teamsCollectionRef,
          where(`members.${userInfo.linkblue}`, '>=', '')
        );
        const matchingTeams = await getDocs(teamQuery);
        if (matchingTeams.docs.length === 1) {
          preloadedTeamSnapshot = matchingTeams.docs[0];
          updateDoc(userSnapshot.ref, { team: preloadedTeamSnapshot.ref });
        }
      }

      if (teamReference) {
        userInfo.teamId = userSnapshot.get('team').id;

        // Go ahead and set up some collection references
        const teamConfidentialRef = collection(
          firebaseFirestore,
          `${userSnapshot.get('team').path}/confidential`
        );

        const teamPromiseResponses = await Promise.allSettled([
          preloadedTeamSnapshot ? undefined : getDoc(userSnapshot.get('team')),
          getDoc(doc(teamConfidentialRef, 'individualSpiritPoints')),
          getDoc(doc(teamConfidentialRef, 'fundraising')),
        ]);

        if (teamPromiseResponses[0].status === 'fulfilled') {
          if (teamPromiseResponses[0].value === undefined) {
            if (preloadedTeamSnapshot) {
              userInfo.team = preloadedTeamSnapshot.data() as FirestoreTeam;
            }
          } else {
            userInfo.team = teamPromiseResponses[0].value.data() as FirestoreTeam;
          }
        }
        if (teamPromiseResponses[1].status === 'fulfilled') {
          userInfo.teamIndividualSpiritPoints =
            teamPromiseResponses[1].value.data() as FirestoreTeamIndividualSpiritPoints;
        }
        if (teamPromiseResponses[2].status === 'fulfilled') {
          userInfo.teamFundraisingTotal =
            teamPromiseResponses[2].value.data() as FirestoreTeamFundraising;
        }
      }
    }

    return userInfo;
  }
);

export const logout = createAsyncThunk('auth/logout', async (arg, thunkApi) =>
  signOut(firebaseAuth).then(async () => {
    // Dispatch the updateUserData action
    thunkApi.dispatch(updateUserData({ isAnonymous: false, userSnapshot: null }));
  })
);

export const syncAuthStateWithUser = createAsyncThunk(
  'auth/syncAuthStateWithUser',
  async (user: User, thunkApi) => {
    let userSnapshot = null;
    if (user?.uid) {
      // Get the user's firebase doc
      userSnapshot = await getDoc(doc(firebaseFirestore, 'users', user.uid));
    }
    // Dispatch the updateUserData action
    thunkApi.dispatch(updateUserData({ isAnonymous: !!user?.isAnonymous, userSnapshot }));
  }
);

export const loginAnon = createAsyncThunk('auth/loginAnon', async (arg, thunkApi) =>
  signInAnonymously(firebaseAuth).then(async (anonUser) => {
    // Get the user's firebase doc
    const userSnapshot = await getDoc(doc(firebaseFirestore, 'users', anonUser.user.uid));
    // Dispatch the updateUserData action
    thunkApi.dispatch(updateUserData({ isAnonymous: true, userSnapshot }));
  })
);

type LoginSamlThunkError = {
  error: 'UNEXPECTED_AUTH_PROVIDER' | 'INVALID_SERVER_RESPONSE';
};
export const loginSaml = createAsyncThunk(
  'auth/loginSaml',
  async (samlUserCredential: UserCredential, thunkApi) => {
    // 1. Do some verification
    // Make sure firebase sent a profile option
    const additionalInfo = getAdditionalUserInfo(samlUserCredential);

    // Make sure this is the provider we think it is
    if (!(additionalInfo?.providerId === 'saml.danceblue-firebase-linkblue-saml')) {
      return thunkApi.rejectWithValue({ error: 'UNEXPECTED_AUTH_PROVIDER' } as LoginSamlThunkError);
    }

    // Make sure we got a profile and email
    if (!additionalInfo?.profile || !samlUserCredential?.user?.email) {
      return thunkApi.rejectWithValue({ error: 'INVALID_SERVER_RESPONSE' } as LoginSamlThunkError);
    }

    // 2. Upload SAML info to firebase
    await setDoc(
      doc(firebaseFirestore, 'users', samlUserCredential.user.uid),
      {
        firstName: additionalInfo.profile['first-name'] || null,
        lastName: additionalInfo.profile['last-name'] || null,
        email: additionalInfo.profile.email,
        linkblue: samlUserCredential.user.email.substring(
          0,
          samlUserCredential.user.email.indexOf('@')
        ),
      },
      { merge: true }
    );
    updateProfile(samlUserCredential.user, {
      displayName:
        typeof additionalInfo.profile['display-name'] === 'string'
          ? additionalInfo.profile['display-name']
          : null,
    });

    // 4. Update user data
    const userSnapshot = await getDoc(doc(firebaseFirestore, 'users', samlUserCredential.user.uid));
    thunkApi.dispatch(updateUserData({ isAnonymous: false, userSnapshot }));

    return;
  }
);

// !!!END OF ACTION DEFINITIONS!!!

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
      // Logout
      .addCase(logout.pending, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(logout.rejected, (state, action) => {
        showMessage(action.error.message, action.error.code, null, true, action.error.stack);
      })
      // User data update
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.isAuthLoaded = true;
        state.uid = action.payload.uid;
        state.isAnonymous = action.payload.isAnonymous;
        state.isLoggedIn = action.payload.isLoggedIn;
        state.attributes = action.payload.attributes;
        state.teamId = action.payload.teamId;
        state.team = action.payload.team;
        state.teamIndividualSpiritPoints = action.payload.teamIndividualSpiritPoints;
        state.teamFundraisingTotal = action.payload.teamFundraisingTotal;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.linkblue = action.payload.linkblue;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        showMessage(action.error.message, action.error.code, null, true, action.error.stack);
      })
      // Anon login
      .addCase(loginAnon.pending, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(loginAnon.rejected, (state, action) => {
        showMessage(action.error.message, action.error.code, null, true, action.error.stack);
      })
      // Login SAML
      .addCase(loginSaml.pending, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(loginSaml.rejected, (state, action) => {
        if (action.error.message === 'Rejected') {
          switch ((action?.payload as LoginSamlThunkError)?.error) {
            case 'UNEXPECTED_AUTH_PROVIDER':
              showMessage(
                'DanceBlue Mobile received an unrecognized response from the login server. Did you log into a website other than UK?',
                'Login Server Error',
                () => {},
                true,
                action
              );
              break;
            case 'INVALID_SERVER_RESPONSE':
              showMessage(
                'DanceBlue Mobile received an invalid response from the login server. Try again later.',
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
      // Sync auth state with user
      .addCase(syncAuthStateWithUser.pending, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(syncAuthStateWithUser.rejected, (state, action) => {
        showMessage(action.error.message, action.error.code, null, true, action.error.stack);
      });
  },
});

export default authSlice.reducer;

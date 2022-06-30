import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { FirestoreNotification, FirestoreTeam, FirestoreTeamFundraising, FirestoreTeamIndividualSpiritPoints, FirestoreUser } from "../types/FirebaseTypes";

import { startLoading, stopLoading } from "./globalLoadingSlice";

export type UserLoginType = "anonymous" | "ms-oath-linkblue";
interface UserDataType {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  linkblue?: string | null;
  attributes: Record<string, string>;
  team: FirestoreTeam | null;
  teamId: string | null;
  teamIndividualSpiritPoints: FirestoreTeamIndividualSpiritPoints | null;
  teamFundraisingTotal: FirestoreTeamFundraising | null;
  userLoginType: UserLoginType | null;
  pastNotifications: FirestoreNotification[];
}

const initialState: UserDataType = {
  firstName: null,
  lastName: null,
  email: null,
  linkblue: null,
  attributes: {},
  team: null,
  teamId: null,
  teamIndividualSpiritPoints: null,
  teamFundraisingTotal: null,
  userLoginType: null,
  pastNotifications: [],
};

export const loadUserData = createAsyncThunk(
  "userData/loadUserData",
  async (payload: { userId: string; loginType: UserLoginType; firestore: FirebaseFirestoreTypes.Module }, { dispatch }): Promise<UserDataType> => {
    dispatch(startLoading("userData/loadUserData"));
    // Get the user's base document
    const userDataDoc = payload.firestore.collection("users").doc(payload.userId);
    const userDataSnapshot = await userDataDoc.get();

    if (!userDataSnapshot.exists) {
      throw new Error("User data not found");
    }

    const rawUserData = userDataSnapshot.data() as FirestoreUser;

    const loadUserData = { ...initialState, loginType: payload.loginType };

    // Check for a user's own data
    if (rawUserData.firstName != null) {
      loadUserData.firstName = rawUserData.firstName;
    }
    if (rawUserData.lastName != null) {
      loadUserData.lastName = rawUserData.lastName;
    }
    if (rawUserData.email != null) {
      loadUserData.email = rawUserData.email;
    }
    if (rawUserData.linkblue != null) {
      loadUserData.linkblue = rawUserData.linkblue;
    }
    if (rawUserData.attributes != null) {
      loadUserData.attributes = rawUserData.attributes;
    }

    // Check for past notifications
    if (rawUserData.pastNotifications != null) {
      const pastNotificationRefs = rawUserData.pastNotifications;
      const pastNotifications: FirestoreNotification[] = [];

      const promises: Promise<void>[] = [];

      for (const pastNotificationRef of pastNotificationRefs) {
        promises.push((async () => {
          const pastNotificationSnapshot = await pastNotificationRef.get();
          if (pastNotificationSnapshot.exists) {
            pastNotifications.push(pastNotificationSnapshot.data() as FirestoreNotification);
          }
        })());
      }

      await Promise.all(promises);
    }


    // Check for a user's team data
    if (rawUserData.team?.id != null) {
      const userTeamDoc = payload.firestore.collection("teams").doc(rawUserData.team.id);
      const userTeamSnapshot = await userTeamDoc.get();

      if (userTeamSnapshot.exists) {
        loadUserData.team = userTeamSnapshot.data() as FirestoreTeam;
        loadUserData.teamId = rawUserData.team.id;

        const userTeamIndividualPointsDoc = payload.firestore.collection(`teams/${rawUserData.team.id}/confidential`).doc("individualSpiritPoints");
        const userTeamIndividualPointsSnapshot = await userTeamIndividualPointsDoc.get();

        if (userTeamIndividualPointsSnapshot.exists) {
          loadUserData.teamIndividualSpiritPoints = userTeamIndividualPointsSnapshot.data() as FirestoreTeamIndividualSpiritPoints;
        }

        const userTeamFundraisingDoc = payload.firestore.collection(`teams/${rawUserData.team.id}/confidential`).doc("fundraising");
        const userTeamFundraisingSnapshot = await userTeamFundraisingDoc.get();

        if (userTeamFundraisingSnapshot.exists) {
          loadUserData.teamFundraisingTotal = userTeamFundraisingSnapshot.data() as FirestoreTeamFundraising;
        }
      }
    }

    dispatch(stopLoading("userData/loadUserData"));

    return loadUserData;
  }
);

const userDataSlice = createSlice({
  name: "userData",
  reducers: {
    loginAnonymously: (state) => {
      Object.assign(state, initialState);
      state.userLoginType = "anonymous";
    }
  },
  initialState,
  extraReducers: (builder) => {
    builder.addCase(loadUserData.pending, (state) => {
      Object.assign(state, initialState);
      state.userLoginType = null;
    });
    builder.addCase(loadUserData.fulfilled, (state, action) => {
      state.userLoginType = action.payload.userLoginType;
    });
    builder.addCase(loadUserData.rejected, (state) => {
      Object.assign(state, initialState);
      state.userLoginType = null;
    });
  }
});

export default userDataSlice.reducer;

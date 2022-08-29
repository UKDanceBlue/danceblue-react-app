import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { log } from "../common/logging";
import { FirestoreNotification, isFirestoreNotification } from "../types/pastNotifications";
import { FirestoreTeam, FirestoreTeamFundraising, FirestoreTeamIndividualSpiritPoints, isFirestoreTeam, isFirestoreTeamFundraising, isFirestoreTeamIndividualSpiritPoints } from "../types/teams";
import { isFirestoreUser } from "../types/users";

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

    const loadedUserData = { ...initialState, loginType: payload.loginType };

    switch (payload.loginType) {
    case "anonymous": {
      break;
    }
    case "ms-oath-linkblue": {
      // Get the user's base document
      const userDataDoc = payload.firestore.collection("users").doc(payload.userId);
      const userDataSnapshot = await userDataDoc.get();

      if (!userDataSnapshot.exists) {
        throw new Error("User data not found");
      }

      const rawUserData = userDataSnapshot.data();

      if (!isFirestoreUser(rawUserData)) {
        throw new Error("User data is not valid");
      }
      // Check for a user's own data
      loadedUserData.firstName = rawUserData.firstName;
      loadedUserData.lastName = rawUserData.lastName;
      loadedUserData.email = rawUserData.email;
      loadedUserData.attributes = rawUserData.attributes;
      if (rawUserData.linkblue != null) {
        loadedUserData.linkblue = rawUserData.linkblue;
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
              const pastNotificationSnapshotData = pastNotificationSnapshot.data();
              if (isFirestoreNotification(pastNotificationSnapshotData)) {
                pastNotifications.push(pastNotificationSnapshotData);
              } else {
                log(`Past notification "${pastNotificationSnapshot.ref.path}" is not valid`, "warn");
              }
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
          const userTeamSnapshotData = userTeamSnapshot.data();
          if (isFirestoreTeam(userTeamSnapshotData)) {
            loadedUserData.team = userTeamSnapshotData;
            loadedUserData.teamId = rawUserData.team.id;

            const userTeamIndividualPointsDoc = payload.firestore.collection(`teams/${rawUserData.team.id}/confidential`).doc("individualSpiritPoints");
            const userTeamIndividualPointsSnapshot = await userTeamIndividualPointsDoc.get();

            if (userTeamIndividualPointsSnapshot.exists) {
              const userTeamIndividualPointsSnapshotData = userTeamIndividualPointsSnapshot.data();
              if (isFirestoreTeamIndividualSpiritPoints(userTeamIndividualPointsSnapshotData)) {
                loadedUserData.teamIndividualSpiritPoints = userTeamIndividualPointsSnapshotData;
              } else {
                log(`Team individual spirit points "${userTeamIndividualPointsSnapshot.ref.path}" is not valid`, "warn");
              }
            }

            const userTeamFundraisingDoc = payload.firestore.collection(`teams/${rawUserData.team.id}/confidential`).doc("fundraising");
            const userTeamFundraisingSnapshot = await userTeamFundraisingDoc.get();

            if (userTeamFundraisingSnapshot.exists) {
              const userTeamFundraisingSnapshotData = userTeamFundraisingSnapshot.data();
              if (isFirestoreTeamFundraising(userTeamFundraisingSnapshotData)) {
                loadedUserData.teamFundraisingTotal = userTeamFundraisingSnapshotData;
              } else {
                log(`Team fundraising "${userTeamFundraisingSnapshot.ref.path}" is not valid`, "warn");
              }
            }
          } else {
            log(`Team "${userTeamSnapshot.ref.path}" is not valid`, "warn");
          }
        }
      }
      break;
    }
    default: {
      dispatch(stopLoading("userData/loadUserData"));
      throw new Error("Invalid login type");
    }
    }

    dispatch(stopLoading("userData/loadUserData"));

    return loadedUserData;
  }
);

const userDataSlice = createSlice({
  name: "userData",
  reducers: {
    loginAnonymously: (state) => {
      Object.assign(state, initialState);
      state.userLoginType = "anonymous";
    },
    enterDemoMode: (state) => {
      Object.assign(state, initialState);
      state.userLoginType = "ms-oath-linkblue";
      state.firstName = "Demo";
      state.lastName = "User";
      state.email = "test@example.com";
      state.linkblue = "abcd123";
    }
  },
  initialState,
  extraReducers: (builder) => {
    builder.addCase(loadUserData.pending, (state) => {
      Object.assign(state, initialState);
      state.userLoginType = null;
    });
    builder.addCase(loadUserData.fulfilled, (state, action) => {
      Object.assign(state, action.payload);
      state.userLoginType = action.payload.userLoginType;
    });
    builder.addCase(loadUserData.rejected, (state) => {
      Object.assign(state, initialState);
      state.userLoginType = null;
    });
  }
});

export default userDataSlice.reducer;
export const {
  loginAnonymously, enterDemoMode
} = userDataSlice.actions;

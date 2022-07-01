import { createSlice } from "@reduxjs/toolkit";

import { FirestoreHour } from "../types/FirebaseTypes";

interface MarathonSliceType {
  marathonHours: FirestoreHour[];
}

const initialState: MarathonSliceType = { marathonHours: [] };

const marathonSlice = createSlice({
  initialState,
  name: "marathon",
  reducers: {}
});

// export const { } = marathonSlice.actions;

export default marathonSlice.reducer;

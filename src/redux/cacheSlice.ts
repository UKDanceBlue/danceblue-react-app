import { createSlice } from "@reduxjs/toolkit";

import { FirestoreNotification } from "../types/FirebaseTypes";

type CachedData<DataType> = {
  data: DataType;
  expireAfter?: Date;
  // We may have data that should be refreshed, but doesn't need to be this is a case for refreshAfter
  refreshAfter?: Date;
  // Omitting both timeouts indicated the data never expires, this should be avoided
};

type CacheSliceType = {
  cachedNotification: { [key: string]: CachedData<FirestoreNotification> };
  cachedImage: { [key: string]: CachedData<string> };
};

const initialState: CacheSliceType = {
  cachedNotification: {},
  cachedImage: {},
};

const cacheSlice = createSlice({
  initialState,
  name: "cache",
  reducers: {}
});

// export const { } = cacheSlice.actions;

export default cacheSlice.reducer;

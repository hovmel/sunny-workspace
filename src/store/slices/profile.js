import { createSlice } from '@reduxjs/toolkit';
import { getSelfProfileRequest } from '../thunks/profile';

const initialState = {
  accessToken: '',
  refreshToken: '',
  profile: {},
  profileSettings: {},
};

export const slice = createSlice({
  initialState,
  name: 'profile',
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
      state.profileSettings = typeof action.payload.settings_web === 'string' ? JSON.parse(action.payload.settings_web) : {};
    },
    logoutReducer: (state, action) => {
      state.accessToken = '';
      state.refreshToken = '';
      state.profile = {};
      state.profileSettings = {};
    },
  },
  extraReducers: {
    [getSelfProfileRequest.fulfilled]: (state, { payload }) => {
      state.profile = payload;
      state.profileSettings = typeof payload.settings_web === 'string' ? JSON.parse(payload.settings_web) : {};
    },
  },
});

export const {
  logoutReducer,
  setAccessToken,
  setRefreshToken,
  setProfile,
} = slice.actions;

export default slice.reducer;

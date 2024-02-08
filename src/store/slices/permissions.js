import { createSlice } from '@reduxjs/toolkit';
import { getPermissionsRequest } from '../thunks/permissions';

const initialState = {
  permissions: [],
};

export const slice = createSlice({
  initialState,
  name: 'permissions',
  reducers: {},
  extraReducers: {
    [getPermissionsRequest.pending]: (state) => {

    },
    [getPermissionsRequest.fulfilled]: (state, { payload }) => {
      state.permissions = payload;
    },
    [getPermissionsRequest.rejected]: (state, { payload }) => {

    },
  },
});

export default slice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { getToolsTypesRequest } from '../thunks/tools';

const initialState = {
  toolsTypes: [],
};

export const slice = createSlice({
  initialState,
  name: 'tools',
  reducers: {},
  extraReducers: {
    [getToolsTypesRequest.fulfilled]: (state, { payload }) => {
      state.toolsTypes = payload;
    },
  },
});

export default slice.reducer;

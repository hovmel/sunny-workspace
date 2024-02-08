import { createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../../api';

export const getToolsTypesRequest = createAsyncThunk(
  'projects/getToolsTypes',
  async () => {
    try {
      const { data } = await Api.getToolsTypes();

      return data;
    } catch (error) {
      return error.message;
    }
  },
);

/*
export const getProjectToolsRequest = createAsyncThunk(
  'projects/getProjectTools',
  async (projectId) => {
    try {
      const { data } = await Api.getProjectTools(projectId);

      return data;
    } catch (error) {
      return error.message;
    }
  },
);
*/

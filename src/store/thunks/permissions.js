import { createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../../api';

export const getPermissionsRequest = createAsyncThunk(
  'permissions/get',
  async () => {
    try {
      const { data } = await Api.getPermissions();

      return data;
    } catch (error) {
      return error.message;
    }
  },
);

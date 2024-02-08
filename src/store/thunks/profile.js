import { createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../../api';
import LocalStorageServices, { STORAGE_KEYS } from '../../helpers/LocalStorageServices';

export const getSelfProfileRequest = createAsyncThunk(
  'getSelfProfile/get',
  async () => {
    try {
      const { data } = await Api.getSelfProfile();

      LocalStorageServices.setItem(STORAGE_KEYS.profile, data);

      return data;
    } catch (error) {
      return error.message;
    }
  },
);

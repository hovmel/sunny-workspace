import { createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../../api';

export const getMyProjectsRequest = createAsyncThunk(
  'projects/getMyProjects',
  async () => {
    try {
      const { data } = await Api.getMyProjects();

      return data;
    } catch (error) {
      return error.message;
    }
  },
);

export const getProjectRequest = createAsyncThunk(
  'projects/getProject',
  async (projectId) => {
    try {
      const { data } = await Api.getProject(projectId);

      return data;
    } catch (error) {
      return error.message;
    }
  },
);

export const getMyProjectRequest = createAsyncThunk(
  'projects/getMyProject',
  async (projectId) => {
    try {
      const { data } = await Api.getMyProject(projectId);

      return data;
    } catch (error) {
      return error.message;
    }
  },
);

export const getProjectPoliciesRequest = createAsyncThunk(
  'projects/getProjectPolicies',
  async (projectId) => {
    try {
      const { data } = await Api.getProjectPolicies(projectId);

      return data;
    } catch (error) {
      return error.message;
    }
  },
);

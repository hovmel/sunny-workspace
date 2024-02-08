import { createSlice } from '@reduxjs/toolkit';
import {
  getMyProjectRequest,
  getMyProjectsRequest,
  getProjectPoliciesRequest,
  getProjectRequest,
} from '../thunks/projects';

const initialState = {
  myProjects: [],
  gettingMyProjectsLoading: true,
  gettingMyProjectsError: '',
  gettingMyProjectsSuccess: false,

  projectPolicies: [],

  selectedProject: {},
  framesQueue: [],

  gettingSelectedProjectSuccess: false,
};

export const slice = createSlice({
  initialState,
  name: 'projects',
  reducers: {
    updateExistingProject: (state, action) => {
      const currentProjectIndex = state.myProjects.findIndex((item) => item.id === action.payload.id);
      if (currentProjectIndex !== -1) {
        state.myProjects[currentProjectIndex] = { ...state.myProjects[currentProjectIndex], ...action.payload };
      }
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
      state.framesQueue = [];
    },
    addFrameToQueue: (state, action) => {
      state.framesQueue = state.framesQueue.filter((item) => JSON.parse(item.settings).keepOpen);
      if (state.framesQueue.findIndex((item) => item.id === action.payload.id) === -1) {
        state.framesQueue.push({ ...action.payload, key: 0 });
      }
    },
    removeFrameFromQueue: (state, action) => {
      state.framesQueue = state.framesQueue.filter((item) => item.id !== action.payload);
    },
    updateFrameKeyFromQueue: (state, action) => {
      const currentFrameIndex = state.framesQueue.findIndex((item) => item.id === action.payload);
      state.framesQueue[currentFrameIndex].key += 1;
    },
  },
  extraReducers: {
    [getMyProjectsRequest.pending]: (state) => {
      state.gettingMyProjectsLoading = true;
      state.gettingMyProjectsSuccess = false;
      state.gettingMyProjectsError = '';
    },
    [getMyProjectsRequest.fulfilled]: (state, { payload }) => {
      state.myProjects = payload;
      state.gettingMyProjectsLoading = false;
      state.gettingMyProjectsSuccess = true;
      state.gettingMyProjectsError = '';
    },
    [getMyProjectsRequest.rejected]: (state, { payload }) => {
      state.gettingMyProjectsLoading = false;
      state.gettingMyProjectsSuccess = false;
      state.gettingMyProjectsError = payload;
    },

    [getMyProjectRequest.pending]: (state) => {
      state.gettingSelectedProjectSuccess = false;
    },
    [getMyProjectRequest.fulfilled]: (state, { payload }) => {
      state.selectedProject = payload;
    },

    [getProjectRequest.pending]: (state) => {
      state.gettingSelectedProjectSuccess = false;
    },
    [getProjectRequest.fulfilled]: (state, { payload }) => {
      state.selectedProject = { ...state.selectedProject, ...payload };
      state.gettingSelectedProjectSuccess = true;
    },

    [getProjectPoliciesRequest.fulfilled]: (state, { payload }) => {
      state.projectPolicies = payload;
    },
  },
});

export const {
  updateExistingProject,
  setSelectedProject,
  addFrameToQueue,
  removeFrameFromQueue,
  updateFrameKeyFromQueue,
} = slice.actions;

export default slice.reducer;

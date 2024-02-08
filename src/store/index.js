import { configureStore, createAction } from '@reduxjs/toolkit';
import profile from './slices/profile';
import permissions from './slices/permissions';
import projects from './slices/projects';
import tools from './slices/tools';

const store = configureStore({
  reducer: {
    profile,
    permissions,
    projects,
    tools,
  },

});

export default store;

import CreateProject from '../pages/projects-pages/create-project';
import EditProject from '../pages/projects-pages/edit-project';
import EditUsers from '../pages/projects-pages/edit-users';
import EditTools from '../pages/projects-pages/edit-tools';
import SingleTool from '../pages/projects-pages/single-tool';
import { SETTINGS_STATE } from './settingsState';

export const SETTINGS_STATE_PAGES = {
  // [SETTINGS_STATE.createProject]: CreateProject,
  [SETTINGS_STATE.editProject]: EditProject,
  [SETTINGS_STATE.editProjectTools]: EditTools,
  [SETTINGS_STATE.editProjectUsers]: EditUsers,
  [SETTINGS_STATE.editSingleTool]: SingleTool,
};

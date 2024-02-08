import { api, API_URL, IMAGE_URL } from './config';

export default class Api {
  static url = API_URL;

  static imageUrl = IMAGE_URL;

  /* Profile start */

  static login(data) {
    return api.post('/auth/login', data);
  }

  static register(data) {
    return api.post('/auth/register', data);
  }

  static logout() {
    return api.post('/auth/logout');
  }

  static getSelfProfile() {
    return api.get('/users');
  }

  static editSelfProfile(data) {
    return api.patch('/users', data);
  }

  static editSelfProfilePhoto(data) {
    return api.post('/users/photo', data);
  }

  static deleteProfile() {
    return api.delete('/users');
  }

  /* Profile end */

  /* Permissions start */

  static getPermissions() {
    return api.get('/permissions');
  }

  /* Permissions end */

  /* Projects start */

  static getMyProjects() {
    return api.get('/projects/get_my_projects');
  }

  static createProject(data) {
    return api.post('/projects', data);
  }

  static getProject(id) { // with users
    return api.get(`/projects/${id}`);
  }

  static getMyProject(id) { // without users, with info of mine in this project
    return api.get(`/projects/get_my_project/${id}`);
  }

  static editProject({ id, ...data }) {
    return api.patch(`/projects/${id}`, data);
  }

  static deleteProject(id) {
    return api.delete(`/projects/${id}`);
  }

  static getProjectPolicies(id) {
    return api.get(`/projects/get_policies/${id}`);
  }

  /* Projects end */

  /* Projects users start */

  static projectAddUsers(data) {
    return api.post('/projects/add_users', data);
  }

  static projectEditUser({ projectId, userId, ...data }) {
    return api.patch(`/projects/${projectId}/${userId}`, data);
  }

  static projectDeleteUser(data) {
    return api.post('/projects/delete_user', data);
  }

  /* Projects users end */

  /* Tools start */

  static getToolsTypes() {
    return api.get('/project-tools');
  }

  static addNewProjectTool(data) {
    return api.post('/project-tools', data);
  }

  static deleteProjectTool(toolId) {
    return api.delete(`/project-tools/${toolId}`);
  }

  static getProjectTools(projectId) {
    return api.get(`/project-tools/project/${projectId}`);
  }

  static getSingleTool(toolId) {
    return api.get(`/project-tools/${toolId}`);
  }

  static updateTool({ toolId, ...data }) {
    return api.patch(`/project-tools/${toolId}`, data);
  }

  static linkToolsAndUsers(data) {
    return api.post('/project-tools/link_tools_users', data);
  }

  static unlinkToolsAndUsers(data) {
    return api.post('/project-tools/unlink_tools_users', data);
  }

  /* Tools end */
}

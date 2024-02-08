import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './css/index.module.scss';
import MyButton from '../../../ui-kit/button';
import MyInput from '../../../ui-kit/input';
import useInputState from '../../../helpers/hooks/useInputState';
import sendRequest from '../../../helpers/sendRequest';
import Api from '../../../api';
import MyRoundButton from '../../../ui-kit/round-button';
import { updateExistingProject } from '../../../store/slices/projects';
import GoBack from '../../../components/go-back';
import { SETTINGS_STATE } from '../../../helpers/settingsState';
import MyModal from '../../../ui-kit/modal';
import MyTagInput from '../../../ui-kit/tag-input';
import MyOrangeButton from '../../../ui-kit/orange-button';
import { getMyProjectsRequest } from '../../../store/thunks/projects';
import { setProfile } from '../../../store/slices/profile';

function EditProject() {
  const dispatch = useDispatch();

  const selectedProject = useSelector((store) => store.projects.selectedProject);
  const myProjects = useSelector((store) => store.projects.myProjects);
  const profileSettings = useSelector((store) => store.profile.profileSettings);

  const [isReady, setIsReady] = useState(false);
  const [editingLoading, setEditingLoading] = useState();
  const [title, setTitle, titleError, setTitleError] = useInputState();

  const [searchParams, setSearchParams] = useSearchParams();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const onUsersEditClick = () => {
    setSearchParams({ 'project-id': searchParams.get('project-id'), 'settings-state': SETTINGS_STATE.editProjectUsers });
  };

  const onToolsEditClick = () => {
    setSearchParams({ 'project-id': searchParams.get('project-id'), 'settings-state': SETTINGS_STATE.editProjectTools });
  };

  const onChangeTitleClick = async (ev) => {
    ev.preventDefault();
    if (!selectedProject?.isProjectManager) {
      return;
    }
    if (title.trim().length < 3) {
      setTitleError('At least 3 characters');
      return;
    }

    const payload = {
      id: selectedProject.id,
      title: title.trim(),
    };

    const { data } = await sendRequest({
      request: Api.editProject,
      payload,
      warnErrorText: 'while editing project',
      setLoading: setEditingLoading,
    });

    if (data) {
      dispatch(updateExistingProject(data));
    }
  };

  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const deleteProject = async () => {
    const { data } = await sendRequest({
      request: Api.deleteProject,
      payload: selectedProject.id,
      warnErrorText: 'while deleting project',
      setLoading: setDeletingLoading,
    });

    if (data?.result === 'success') {
      const lastOpenedProjectId = myProjects.length > 1 ? myProjects[0].id !== selectedProject.id ? myProjects[0].id : myProjects[1].id : null;
      const newSettings = { ...profileSettings, lastOpenedProjectId };

      const payload = {
        settings_web: JSON.stringify(newSettings),
      };
      dispatch(getMyProjectsRequest());

      const { data: data2 } = await sendRequest({
        request: Api.editSelfProfile,
        payload,
        warnErrorText: 'while editing profile',
      });

      if (data2?.id) {
        dispatch(setProfile(data2));
      }

      closeDeleteModal();
      if (lastOpenedProjectId) {
        setSearchParams({ 'project-id': lastOpenedProjectId });
      } else {
        setSearchParams({});
      }
      location.reload();
    }
  };

  useEffect(() => {
    if (selectedProject?.id) {
      setTitle(selectedProject.title);
      setIsReady(true);
    }
  }, [selectedProject]);

  return (
    <div>
      <GoBack text="Editing project" />
      <div className={styles.editProjectView}>
        <form className={styles.editProjectViewTop} onSubmit={onChangeTitleClick}>
          <MyInput
            value={title}
            onChange={setTitle}
            error={titleError}
            wrapperClassName={styles.editProjectViewTopInput}
            label="Title"
            placeholder="Sunny Team Project"
            disabled={!selectedProject?.isProjectManager}
          />
          {selectedProject?.isProjectManager && (
            <MyRoundButton
              iconUri="/images/done.png"
              onClick={onChangeTitleClick}
              loading={editingLoading}
              disabled={!isReady || title.trim() === selectedProject.title}
              className={styles.editProjectViewTopButton}
            />
          )}

        </form>

        <div className={styles.buttonsView}>
          {selectedProject?.isUsersManager && (
            <MyButton
              className={styles.editProjectViewAddButton}
              text="Edit project users"
              onClick={onUsersEditClick}
              iconUri="/images/arrow-right.png"
            />
          )}
          {selectedProject?.isToolsManager && (
            <MyButton
              className={styles.editProjectViewAddButton}
              text="Edit project tools"
              onClick={onToolsEditClick}
              iconUri="/images/arrow-right.png"
            />
          )}
        </div>

        {selectedProject?.isProjectManager && (
          <>
            <div className={styles.line} />
            <MyButton
              className={styles.editProjectViewAddButton}
              text="Delete project"
              onClick={openDeleteModal}
            />
          </>
        )}

      </div>

      <MyModal
        isOpen={isDeleteModalOpen}
        closeFunction={closeDeleteModal}
      >
        <div className={styles.modalWrapper}>
          <p className={styles.modalWrapperText}>Are you sure you want to irrevocably delete this project?</p>
          <div className={styles.modalWrapperButtonsRow}>
            <MyButton
              text="Cancel"
              className={styles.modalWrapperButton}
              onClick={closeDeleteModal}
              disabled={deletingLoading}
            />
            <MyOrangeButton
              text="Yes"
              className={styles.modalWrapperButton}
              onClick={deleteProject}
              loading={deletingLoading}
            />
          </div>
        </div>
      </MyModal>
    </div>
  );
}

export default EditProject;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import styles from './css/index.module.scss';
import Loading from '../../../ui-kit/loading';
import MyOrangeButton from '../../../ui-kit/orange-button';
import sendRequest from '../../../helpers/sendRequest';
import Api from '../../../api';
import MyModal from '../../../ui-kit/modal';
import MyTagInput from '../../../ui-kit/tag-input';
import { REGEXP } from '../../../helpers/constants';
import UserItem from './components/UserItem';
import EditUserModal from './components/EditUserModal';
import {
  getMyProjectRequest,
  getMyProjectsRequest,
  getProjectPoliciesRequest,
  getProjectRequest,
} from '../../../store/thunks/projects';
import { getPermissionsRequest } from '../../../store/thunks/permissions';
import MyRoundButton from '../../../ui-kit/round-button';
import MyButton from '../../../ui-kit/button';
import useInputState from '../../../helpers/hooks/useInputState';
import GoBack from '../../../components/go-back';
import { updateExistingProject } from '../../../store/slices/projects';

function EditUsers() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedProject = useSelector((store) => store.projects.selectedProject);
  const gettingSelectedProjectSuccess = useSelector((store) => store.projects.gettingSelectedProjectSuccess);
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get('project-id');

  const [currentProjectTools, setCurrentProjectTools] = useState([]);
  const [gettingLoading, setGettingLoading] = useState();

  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
  const [isDeleteUserModalVisible, setIsDeleteUserModalVisible] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [usersEmails, setUsersEmails, usersEmailsError, setUserEmailsError] = useInputState([]);
  const [addUsersLoading, setAddUsersLoading] = useState(false);
  const [editUserLoading, setEditUserLoading] = useState(false);

  const openAddUserModal = () => {
    setIsAddUserModalVisible(true);
  };
  const closeAddUserModal = () => {
    setUsersEmails([]);
    setIsAddUserModalVisible(false);
  };
  const openEditUserModal = () => {
    setIsEditUserModalVisible(true);
  };
  const closeEditUserModal = () => {
    setIsEditUserModalVisible(false);
    setTimeout(() => setSelectedUser(null), 400);
  };
  const openDeleteUserModal = () => {
    setIsDeleteUserModalVisible(true);
  };
  const closeDeleteUserModal = () => {
    setIsDeleteUserModalVisible(false);
    setTimeout(() => setSelectedUser(null), 400);
  };

  const findUserByEmail = (email) => selectedProject.users?.find((user) => user.login === email);

  const beforeAddUsersValidate = (tag) => {
    let flag = false;

    if (!REGEXP.email.test(tag)) {
      setUserEmailsError('Wrong email format');
      flag = true;
    }
    if (findUserByEmail(tag)) {
      setUserEmailsError('There is a user with such email in this project');
      flag = true;
    }

    return !flag;
  };

  const onAddUsers = async () => {
    const payload = {
      project_id: selectedProject.id,
      users: usersEmails.map((item) => ({
        login: item,
      })),
    };

    const { data } = await sendRequest({
      request: Api.projectAddUsers,
      payload,
      warnErrorText: 'while logging',
      setLoading: setAddUsersLoading,
    });

    if (data?.result === 'success') {
      dispatch(getProjectRequest(selectedProject.id));
      closeAddUserModal();
      setTimeout(() => setUsersEmails([]), 400);
    }
  };

  const onEditUser = async (payload, savingToolsFn) => {
    setEditUserLoading(true);
    await savingToolsFn();
    payload.projectId = selectedProject.id;

    const { data } = await sendRequest({
      request: Api.projectEditUser,
      payload,
      warnErrorText: 'while editing user in project',
      setLoading: setEditUserLoading,
    });

    if (data?.result === 'success') {
      dispatch(getProjectRequest(selectedProject.id));
      closeEditUserModal();
    }
  };

  const onDeleteUser = async () => {
    const payload = {
      project_id: selectedProject.id,
      user_id: selectedUser.id,
    };

    const { data } = await sendRequest({
      request: Api.projectDeleteUser,
      payload,
      warnErrorText: 'while editing user in project',
      setLoading: setEditUserLoading,
    });

    if (data?.result === 'success') {
      dispatch(getProjectRequest(selectedProject.id));
      closeDeleteUserModal();
    }
  };

  const getCurrentProjectTools = async () => {
    const { data } = await sendRequest({
      request: Api.getProjectTools,
      payload: projectId,
      warnErrorText: 'while getting project tools',
      setLoading: setGettingLoading,
    });

    if (data?.length) {
      setCurrentProjectTools(data);
    }
  };

  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(getProjectPoliciesRequest(selectedProject.id));
      dispatch(getPermissionsRequest());
      getCurrentProjectTools().then();
    }
  }, [selectedProject?.id]);

  return (
    <div className={styles.editUsers}>
      <GoBack text="Editing project users" />
      <div className={styles.editUsersView}>

        {!selectedProject.users?.length && gettingSelectedProjectSuccess ? (
          <div className={styles.editUsersViewNoUser}>
            <p className={styles.editUsersViewNoUserText}>There are no users linked to this project</p>
            <MyOrangeButton
              className={styles.editUsersViewAddButton}
              text="Add"
              onClick={openAddUserModal}
            />
          </div>
        ) : (
          <>
            <div className={styles.editUsersViewScroll}>
              {
                _.sortBy(selectedProject.users, (i) => i.id).reverse().map((user) => (
                  <UserItem
                    user={user}
                    key={user.id}
                    setSelectedUser={setSelectedUser}
                    openEditUserModal={openEditUserModal}
                    openDeleteUserModal={openDeleteUserModal}
                  />
                ))
              }
            </div>
            <MyRoundButton
              onClick={openAddUserModal}
              iconUri="/images/add.png"
              className={styles.editUsersViewAddButtonSecond}
            />
          </>

        )}
      </div>

      <MyModal
        isOpen={isAddUserModalVisible}
        closeFunction={closeAddUserModal}
        closeOnPressOutside={false}
      >
        <div className={styles.modalWrapper}>
          <p className={styles.modalWrapperText}>Set users&apos; mails that you want to invite to this project separated by space/tab/enter/comma</p>
          <MyTagInput
            value={usersEmails}
            onChange={setUsersEmails}
            placeholder="some@gmail.com"
            error={usersEmailsError}
            beforeAddValidate={beforeAddUsersValidate}
          />
          <div className={styles.modalWrapperButtonsRow}>
            <MyButton
              text="Cancel"
              className={styles.modalWrapperButton}
              onClick={closeAddUserModal}
            />
            <MyOrangeButton
              text="Add"
              disabled={!usersEmails?.length}
              className={styles.modalWrapperButton}
              onClick={onAddUsers}
            />
          </div>
        </div>
      </MyModal>

      <MyModal
        isOpen={isDeleteUserModalVisible}
        closeFunction={closeDeleteUserModal}
      >
        <div className={styles.modalWrapper}>
          <p className={styles.modalWrapperText}>
            Do you want to remove
            {' '}
            {selectedUser?.login}
            {' '}
            from this project?
          </p>
          <div className={styles.modalWrapperButtonsRow}>
            <MyButton
              text="Cancel"
              className={styles.modalWrapperButton}
              onClick={closeDeleteUserModal}
            />
            <MyOrangeButton
              text="Remove"
              className={styles.modalWrapperButton}
              onClick={onDeleteUser}
            />
          </div>
        </div>
      </MyModal>

      <MyModal
        isOpen={isEditUserModalVisible}
        closeFunction={closeEditUserModal}
        closeOnPressOutside={false}
      >
        <EditUserModal
          user={selectedUser || {}}
          onClose={closeEditUserModal}
          onSave={onEditUser}
          loading={editUserLoading}
          currentProjectTools={currentProjectTools}
        />
      </MyModal>
    </div>
  );
}

export default EditUsers;

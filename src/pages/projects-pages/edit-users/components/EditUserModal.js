import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '../css/index.module.scss';
import MyOrangeButton from '../../../../ui-kit/orange-button';
import MyButton from '../../../../ui-kit/button';
import MyInput from '../../../../ui-kit/input';
import useInputState from '../../../../helpers/hooks/useInputState';
import MyMultiSelect from '../../../../ui-kit/multi-select';
import MySelect from '../../../../ui-kit/select';
import useSelectData from '../../../../helpers/hooks/useSelectData';
import Api from '../../../../api';

function EditUserModal({
  user, onSave, onClose, loading, currentProjectTools,
}) {
  const policies = useSelector((store) => store.projects.projectPolicies);
  const permissionsData = useSelector((store) => store.permissions.permissions);
  const [position, setPosition] = useInputState();
  const [permissions, setPermissions] = useState([]);
  const [policy, setPolicy] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);

  const permissionsOptions = useSelectData(permissionsData);
  const policiesOptions = useSelectData(policies);
  const toolsOptions = useSelectData(currentProjectTools);

  const saveToolsChanges = async () => {
    const toolsToAdd = [];
    const toolsToDelete = [];

    user.tools.forEach((tool) => {
      if (selectedTools.findIndex((el) => el.value === tool.id) === -1) {
        toolsToDelete.push(tool.id);
      }
    });
    selectedTools.forEach((tool) => {
      if (user.tools.findIndex((el) => tool.value === el.id) === -1) {
        toolsToAdd.push(tool.value);
      }
    });

    const payload = {
      project_user_id: user.project_user_id,
    };

    if (toolsToAdd.length) {
      payload.project_tool_ids = toolsToAdd;
      await Api.linkToolsAndUsers(payload);
    }

    if (toolsToDelete.length) {
      payload.project_tool_ids = toolsToDelete;
      await Api.unlinkToolsAndUsers(payload);
    }
  };

  const onSaveClick = () => {
    const payload = {
      userId: user.id,
    };

    if (policy) {
      payload.policy_id = policy.value;
    }
    if (position) {
      payload.position = position;
    }
    if (permissions) {
      payload.permissions = permissions.map((item) => item.value);
    }

    onSave(payload, saveToolsChanges);
  };

  useEffect(() => {
    if (user?.position) {
      setPosition(user.position);
    }
    if (user?.policy?.id) {
      setPolicy([{ value: user.policy.id, label: user.policy.title }]);
    }
    if (user?.permissions?.length) {
      setPermissions(user.permissions.map((item) => ({ value: item.id, label: item.title })));
    }
    if (user?.tools?.length) {
      setSelectedTools(user.tools.map((item) => ({ value: item.id, label: item.title })));
    }
  }, [user]);

  return (
    <div className={styles.modalWrapper}>
      <p className={styles.modalWrapperText}>
        Editing user:
        {' '}
        {user.login}
      </p>
      <p className={styles.modalWrapperSmallText}>
        {`${user.first_name || ''} ${user.last_name || ''}`}
      </p>

      <MyInput
        value={position}
        onChange={setPosition}
        label="Position"
        placeholder="Set user position in this project"
        className={styles.modalWrapperInputBlock}
      />

      <MyMultiSelect
        data={permissionsOptions}
        value={permissions}
        onChange={setPermissions}
        label="Permissions"
        placeholder="Set user permissions in this project"
        className={styles.modalWrapperInputBlock}
      />

      <MyMultiSelect
        data={toolsOptions}
        value={selectedTools}
        onChange={setSelectedTools}
        label="Tools"
        placeholder="Set project tools that user has access to"
        className={styles.modalWrapperInputBlock}
      />

      <MySelect
        data={policiesOptions}
        value={policy}
        onChange={setPolicy}
        label="Policy"
        placeholder="Select user policy in this project"
        className={styles.modalWrapperInputBlock}
      />

      <div className={styles.modalWrapperButtonsRow}>
        <MyButton
          text="Cancel"
          className={styles.modalWrapperButton}
          onClick={onClose}
          disabled={loading}
        />
        <MyOrangeButton
          text="Save"
          className={styles.modalWrapperButton}
          onClick={onSaveClick}
          loading={loading}
        />
      </div>

    </div>
  );
}

export default EditUserModal;

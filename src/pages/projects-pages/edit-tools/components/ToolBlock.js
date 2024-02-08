import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from '../css/index.module.scss';
import ShadowView from '../../../../ui-kit/shadow-view';
import { SHADOW_PROPERTIES } from '../../../../helpers/constants';
import MyInput from '../../../../ui-kit/input';
import MySelect from '../../../../ui-kit/select';
import MyRoundButton from '../../../../ui-kit/round-button';
import useSelectData from '../../../../helpers/hooks/useSelectData';
import useInputState from '../../../../helpers/hooks/useInputState';
import sendRequest from '../../../../helpers/sendRequest';
import Api from '../../../../api';
import MyMultiSelect from '../../../../ui-kit/multi-select';
import MyButton from '../../../../ui-kit/button';
import MyModal from '../../../../ui-kit/modal';
import MyOrangeButton from '../../../../ui-kit/orange-button';
import { TOOL_TYPE_DEFAULT_SETTINGS } from '../../../../helpers/local-data/tool-type-default-settings';
import { SETTINGS_STATE } from '../../../../helpers/settingsState';
import { updateExistingProject } from '../../../../store/slices/projects';
import { getProjectRequest } from '../../../../store/thunks/projects';

function ToolBlock({
  blockObject, index, projectId, currentProjectTools, toolKey, users,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toolsTypes = useSelector((store) => store.tools.toolsTypes);
  const selectedProject = useSelector((store) => store.projects.selectedProject);
  const toolsTypesOptions = useSelectData(toolsTypes);
  const usersOptions = useSelectData(users);

  const [newToolName, setNewToolName, newToolNameError, setNewToolNameError] = useInputState();
  const [newToolType, setNewToolType, newToolTypeError, setNewToolTypeError] = useInputState();
  const [addingLoading, setAddingLoading] = useState();
  const [deletingLoading, setDeletingLoading] = useState();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState(null);
  const [currentTools, setCurrentTools] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const onConfigurationClick = (toolId) => () => {
    setSearchParams({
      'project-id': searchParams.get('project-id'),
      'settings-state': SETTINGS_STATE.editSingleTool,
      'set-tool-id': toolId,
    });
  };

  const openDeleteModal = (tool) => () => {
    setToolToDelete(tool);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTimeout(() => setToolToDelete(null), 400);
  };

  const onAddingError = (err) => {
    if (err?.error === 'name_not_unique') {
      setNewToolNameError('There is a tool in this group with the same name');
    }
  };

  const addNewTool = async () => {
    let flag = false;
    if (newToolName.length < 3) {
      setNewToolNameError('At least 3 characters');
      flag = true;
    }
    if (!newToolType) {
      setNewToolTypeError('Select tool type');
      flag = true;
    }
    if (flag) return;

    const payload = {
      project_id: projectId,
      tool_id: newToolType.value,
      title: newToolName,
      settings: JSON.stringify(TOOL_TYPE_DEFAULT_SETTINGS[newToolType.label]),
      parent: 0,
      order: (currentTools.at(-1)?.order || 0) + 1,
      group: blockObject.value,
    };

    const { data } = await sendRequest({
      request: Api.addNewProjectTool,
      payload,
      warnErrorText: 'while adding new project tool',
      setLoading: setAddingLoading,
      setError: onAddingError,
    });

    if (data?.id) {
      data.tool_type = { id: newToolType.value, title: newToolType.label };
      setNewToolName('', true);
      setNewToolType(null, true);

      setCurrentTools((prev) => [...prev, data]);

      dispatch(getProjectRequest(selectedProject.id));
    }
  };

  const deleteTool = async () => {
    const { data } = await sendRequest({
      request: Api.deleteProjectTool,
      payload: toolToDelete.id,
      warnErrorText: 'while deleting project tool',
      setLoading: setDeletingLoading,
    });

    if (data?.result === 'success') {
      setCurrentTools((prev) => [...prev.filter((el) => el.id !== toolToDelete.id)]);
      closeDeleteModal();

      dispatch(getProjectRequest(selectedProject.id));
    }
  };

  useEffect(() => {
    const sortedTools = currentProjectTools[toolKey]?.sort((prev, curr) => (prev.order - curr.order));
    setCurrentTools(sortedTools);
  }, [currentProjectTools[toolKey]]);

  return (
    <div className={styles.toolBlock}>
      <p className={styles.toolBlockTitle}>
        {index + 1}
        )
        {' '}
        {blockObject.name}
      </p>

      {currentTools?.map((tool) => (
        <ShadowView
          key={tool.id}
          shadowType={SHADOW_PROPERTIES.out2}
          className={styles.toolItem}
        >

          <p className={styles.toolItemTitle}>{tool.title}</p>
          <p className={styles.toolItemTypeTitle}>{tool.tool_type.title}</p>

          <MyButton
            text="Configuration"
            onClick={onConfigurationClick(tool.id)}
            className={styles.toolItemButton}
          />

          <MyRoundButton
            iconUri="/images/delete.png"
            onClick={openDeleteModal(tool)}
            isBackgroundActive={false}
          />
        </ShadowView>
      ))}

      <ShadowView shadowType={SHADOW_PROPERTIES.out2} className={styles.addTool}>
        <MyInput
          wrapperClassName={styles.toolInputWrapper}
          className={styles.toolInput}
          placeholder="Name of tool"
          value={newToolName}
          onChange={setNewToolName}
          error={newToolNameError}
          withoutErrorHeight
        />
        <MySelect
          wrapperClassName={styles.toolSelectWrapper}
          data={toolsTypesOptions}
          placeholder="Type"
          value={newToolType}
          onChange={setNewToolType}
          error={newToolTypeError}
        />
        <MyRoundButton
          iconUri="/images/add.png"
          onClick={addNewTool}
          loading={addingLoading}
        />
      </ShadowView>

      <MyModal
        isOpen={isDeleteModalOpen}
        closeFunction={closeDeleteModal}
      >
        <div className={styles.modalWrapper}>
          <p className={styles.modalWrapperText}>
            Do you want to remove
            {' '}
            {toolToDelete?.title}
            {' '}
            from this project?
          </p>
          <div className={styles.modalWrapperButtonsRow}>
            <MyButton
              text="Cancel"
              className={styles.modalWrapperButton}
              onClick={closeDeleteModal}
              disabled={deletingLoading}
            />
            <MyOrangeButton
              text="Remove"
              className={styles.modalWrapperButton}
              onClick={deleteTool}
              loading={deletingLoading}
            />
          </div>
        </div>
      </MyModal>
    </div>
  );
}

export default ToolBlock;

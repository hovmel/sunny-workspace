import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './css/index.module.scss';
import Loading from '../../../ui-kit/loading';
import sendRequest from '../../../helpers/sendRequest';
import Api from '../../../api';
import UrlPart from './components/UrlPart';
import MyOrangeButton from '../../../ui-kit/orange-button';
import MyMultiSelect from '../../../ui-kit/multi-select';
import useSelectData from '../../../helpers/hooks/useSelectData';
import IFramePart from './components/IFramePart';
import GoBack from '../../../components/go-back';
import { updateExistingProject } from '../../../store/slices/projects';
import { getProjectRequest } from '../../../store/thunks/projects';
import VncPart from './components/VncPart';

function SingleTool() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedProject = useSelector((store) => store.projects.selectedProject);

  const [searchParams, setSearchParams] = useSearchParams();
  const toolId = searchParams.get('set-tool-id');

  const [currentTool, setCurrentTool] = useState();
  const [currentToolSettings, setCurrentToolSettings] = useState({});
  const [gettingLoading, setGettingLoading] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const usersOptions = useSelectData(selectedProject?.users, { id: 'project_user_id', label: 'login' });

  const getCurrentProject = async (projectId) => {
    /* const { data } = await sendRequest({
      request: Api.getMyProject,
      payload: projectId,
      warnErrorText: 'while getting project',
      setLoading: setGettingLoading,
    });

    if (data) {
      setCurrentProject(data);
    } */
  };

  const getCurrentTool = async () => {
    const { data } = await sendRequest({
      request: Api.getSingleTool,
      payload: toolId,
      warnErrorText: 'while getting tool',
      setLoading: setGettingLoading,
    });

    if (data) {
      setCurrentTool(data);
      setCurrentToolSettings(JSON.parse(data.settings));
      setSelectedUsers(data.users.map((user) => ({ value: user.project_user_id, label: user.login })));
      return data;
    }
  };

  const showActiveToolTypeSettings = () => {
    let Component = 'div';
    switch (currentTool.tool_type.title) {
      case 'URL':
        Component = UrlPart;
        break;
      case 'iFrame':
        Component = IFramePart;
        break;
      case 'VNC':
        Component = VncPart;
        break;
      default:
        break;
    }
    return (
      <Component
        settings={currentToolSettings}
        setSettings={setCurrentToolSettings}
      />
    );
  };

  const saveUsersChanges = async () => {
    const usersToAdd = [];
    const usersToDelete = [];

    currentTool.users.forEach((user) => {
      if (selectedUsers.findIndex((el) => el.value === user.project_user_id) === -1) {
        usersToDelete.push(user.project_user_id);
      }
    });
    selectedUsers.forEach((user) => {
      if (currentTool.users.findIndex((el) => user.value === el.project_user_id) === -1) {
        usersToAdd.push(user.value);
      }
    });

    const payload = {
      project_tool_id: currentTool.id,
    };
    setSavingLoading(true);

    if (usersToAdd.length) {
      payload.project_user_ids = usersToAdd;
      await Api.linkToolsAndUsers(payload);
    }

    if (usersToDelete.length) {
      payload.project_user_ids = usersToDelete;
      await Api.unlinkToolsAndUsers(payload);
    }
  };

  const save = async () => {
    const payload = {
      toolId,
      settings: JSON.stringify(currentToolSettings),
    };

    await saveUsersChanges();
    const { data } = await sendRequest({
      request: Api.updateTool,
      payload,
      warnErrorText: 'while saving tool',
      setLoading: setSavingLoading,
    });

    if (data?.id) {
      navigate(-1);

      dispatch(getProjectRequest(selectedProject.id));
    }
  };

  useEffect(() => {
    if (toolId) {
      (async () => {
        const tool = await getCurrentTool();

        if (tool?.project_id) {
          await getCurrentProject(tool.project_id);
        }
      })();
    }
  }, [toolId]);

  return (
    <div className={styles.singleTool}>
      {(!selectedProject || !currentTool) && gettingLoading ? (
        <Loading
          height={40}
          width={40}
          wholeSpace
        />
      ) : !currentTool ? (
        <p className={styles.noProjectText}>
          No tool found with id
          {' '}
          {toolId}
        </p>
      ) : (
        <div className={styles.toolWrapper}>
          <GoBack text={currentTool.title} />

          <p className={styles.toolTitleSmall}>{currentTool.tool_type.title}</p>

          <MyMultiSelect
            label="Users"
            placeholder="example@gmail.com"
            className={styles.toolUsers}
            data={usersOptions}
            value={selectedUsers}
            onChange={setSelectedUsers}
          />

          {showActiveToolTypeSettings()}

          <MyOrangeButton
            text="Save"
            onClick={save}
            loading={savingLoading}
          />
        </div>
      )}
    </div>
  );
}

export default SingleTool;

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { VncScreen } from 'react-vnc';
import styles from './css/index.module.scss';
import Wrapper from '../../components/wrapper';
import { setSelectedProject } from '../../store/slices/projects';
import { getMyProjectsRequest } from '../../store/thunks/projects';
import { SETTINGS_STATE } from '../../helpers/settingsState';
import { SETTINGS_STATE_PAGES } from '../../helpers/settingsStatePages';
import Api from '../../api';
import MyLoading from '../../ui-kit/loading';
import MyButton from '../../ui-kit/button';
import sendRequest from '../../helpers/sendRequest';

function Dashboard() {
  const dispatch = useDispatch();
  const profile = useSelector((store) => store.profile.profile);
  const profileSettings = useSelector((store) => store.profile.profileSettings);

  const myProjects = useSelector((store) => store.projects.myProjects);
  const gettingMyProjectsSuccess = useSelector((store) => store.projects.gettingMyProjectsSuccess);
  const gettingMyProjectsLoading = useSelector((store) => store.projects.gettingMyProjectsLoading);
  const selectedProject = useSelector((store) => store.projects.selectedProject);
  const framesQueue = useSelector((store) => store.projects.framesQueue);

  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get('project-id');
  const toolId = searchParams.get('tool-id');
  const settingsState = searchParams.get('settings-state');

  const CurrentPage = useMemo(() => (SETTINGS_STATE_PAGES[settingsState]), [settingsState]);

  const [noProjectError, setNoProjectError] = useState(false);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const createProject = async () => {
    const { data } = await sendRequest({
      request: Api.createProject,
      payload: { title: 'Untitled' },
      warnErrorText: 'while creating project',
      setLoading: setCreatingLoading,
    });

    if (data?.id) {
      dispatch(getMyProjectsRequest());

      const payload = {
        settings_web: JSON.stringify({ ...profileSettings, lastOpenedProjectId: data.id }),
      };

      setSearchParams({ 'project-id': data.id, 'settings-state': SETTINGS_STATE.editProject });

      await sendRequest({
        request: Api.editSelfProfile,
        payload,
        warnErrorText: 'while editing profile',
      });
    }
  };

  useEffect(() => {
    (async () => {
      if (myProjects?.length && projectId) {
        const currentProject = myProjects.find((item) => item.id === +projectId);
        if (currentProject) {
          dispatch(setSelectedProject(currentProject));
          const { data } = await Api.getMyProject(+projectId);
          dispatch(setSelectedProject(data));
        } else {
          setNoProjectError(true);
        }
      } else if (!gettingMyProjectsSuccess) {
        dispatch(getMyProjectsRequest());
      }
    })();
  }, [myProjects, projectId]);

  useEffect(() => {
    // check if I am admin on new selected project
    if (!selectedProject?.permissions) {
      setIsReady(true);
      return;
    }
    (async () => {
      const isProjectManager = !!selectedProject.permissions.find((item) => item.id === 'project_manager');
      const isToolsManager = isProjectManager || selectedProject.permissions.find((item) => item.id === 'tools_manager');
      const isUsersManager = isProjectManager || selectedProject.permissions.find((item) => item.id === 'users_manager');

      if (isProjectManager) {
        dispatch(setSelectedProject({
          ...selectedProject, hasRoleInSelectedProject: true, isProjectManager: true,
        }));
      }

      if (!isToolsManager && [SETTINGS_STATE.editProjectTools, SETTINGS_STATE.editSingleTool].includes(settingsState)) {
        searchParams.delete('settings-state');
        setSearchParams(searchParams);
      }
      if (!isUsersManager && [SETTINGS_STATE.editProjectUsers].includes(settingsState)) {
        searchParams.delete('settings-state');
        setSearchParams(searchParams);
      }
      if (!isProjectManager && !isToolsManager && !isUsersManager) {
        if (Object.values(SETTINGS_STATE).includes(settingsState)) {
          searchParams.delete('settings-state');
          setSearchParams(searchParams);
        }
      } else {
        let newData = {};
        if (isUsersManager) {
          const { data } = await sendRequest({
            request: Api.getProject,
            payload: selectedProject.id,
            warnErrorText: 'while getting project',
          });
          newData = data;
        }

        dispatch(setSelectedProject({
          ...selectedProject, ...newData, hasRoleInSelectedProject: true, isProjectManager, isUsersManager, isToolsManager,
        }));
      }

      setIsReady(true);
    })();
  }, [selectedProject?.permissions?.length]);

  useEffect(() => {
    if (profile?.id && myProjects?.length && profileSettings && (!projectId || projectId === 'undefined')) {
      const lastOpenedProjectId = profileSettings.lastOpenedProjectId || myProjects[0].id;
      if (lastOpenedProjectId) {
        setSearchParams({ 'project-id': lastOpenedProjectId });
      }
    }
  }, [profile, profileSettings, myProjects]);

  return (
    <Wrapper
      withGoBack={false}
      withNavBar={Boolean(myProjects?.length)}
    >
      {gettingMyProjectsLoading ? null
        : !myProjects?.length ? (
          <div className={styles.infoView}>
            <p className={styles.infoViewText}>
              You do not have any projects yet
            </p>

            <MyButton
              text="Create"
              onClick={createProject}
              loading={creatingLoading}
            />
          </div>
        ) : noProjectError ? (
          <p className={styles.infoText}>
            There is no project with id:
            {' '}
            {projectId}
          </p>
        ) : SETTINGS_STATE[settingsState] ? (
          <CurrentPage />
        ) : !framesQueue.length ? (
          <p className={styles.infoText}>
            Choose the tools you want to work on
          </p>
        ) : (
          <div className={styles.framesWrapper}>
            {
            framesQueue.map((frame, index) => (
              <div
                key={`${frame.id}-${frame.key}`}
                className={`${styles.frameItem} ${+toolId === frame.id && styles.frameItemActive}`}
              >
                {frame.tool_type.title === 'iFrame' ? (
                  <iframe
                    title="Main frame"
                    src={JSON.parse(frame.settings).baseUrl}
                    className={styles.iframe}
                  />
                ) : (
                  <VncScreen
                    url={JSON.parse(frame.settings).vncUrl}
                    scaleViewport
                    background="#000000"
                    className={styles.vnc}
                    rfbOptions={JSON.parse(frame.settings).password && {
                      credentials: {
                        password: JSON.parse(frame.settings).password,
                      },
                    }}
                    loadingUI={(
                      <div className={styles.vncLoading}>
                        <MyLoading
                          wholeSpace
                          width={40}
                          height={40}
                        />
                      </div>
                    )}
                  />
                )}

              </div>

            ))
          }
          </div>
        )}

      {/* {((gettingMyProjectsLoading && !myProjects?.length) || !isReady) && (
        <div className={styles.wholeLoading}>
          <MyLoading
            wholeSpace
            width={40}
            height={40}
          />
        </div>
      )} */}
    </Wrapper>
  );
}

export default Dashboard;

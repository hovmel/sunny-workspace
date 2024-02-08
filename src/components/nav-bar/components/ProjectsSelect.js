import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MySelect from '../../../ui-kit/select';
import useSelectData from '../../../helpers/hooks/useSelectData';
import { setSelectedProject } from '../../../store/slices/projects';
import sendRequest from '../../../helpers/sendRequest';
import Api from '../../../api';
import { setProfile } from '../../../store/slices/profile';
import { getMyProjectsRequest } from '../../../store/thunks/projects';
import { SETTINGS_STATE } from '../../../helpers/settingsState';

function ProjectsSelect() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileSettings = useSelector((store) => store.profile.profileSettings);

  const myProjects = useSelector((store) => store.projects.myProjects);
  const selectedProject = useSelector((store) => store.projects.selectedProject);

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedProjectFormatted = useMemo(() => {
    if (selectedProject?.id) {
      return {
        value: selectedProject.id,
        label: selectedProject.title,
      };
    }
  }, [selectedProject]);

  const projectsOptions = useSelectData(myProjects);

  const finalProjectsOptions = useMemo(() => [...projectsOptions, {
    value: 'new',
    label: 'Create new project',
  }], [projectsOptions]);

  const getSelectedProject = (id) => sendRequest({
    request: Api.getMyProject,
    payload: id,
    warnErrorText: 'while getting project',
  });

  const onChangeProject = async (val) => {
    if (selectedProject?.id === val.value) return;
    let toSettings = false;

    if (val.value === 'new') {
      const { data } = await sendRequest({
        request: Api.createProject,
        payload: { title: 'Untitled' },
        warnErrorText: 'while creating project',
      });

      if (data?.id) {
        dispatch(getMyProjectsRequest());

        val.value = data.id;
        val.label = data.title;
        toSettings = true;
      } else {
        return;
      }
    }

    if (toSettings) {
      setSearchParams({ 'project-id': val.value, 'settings-state': SETTINGS_STATE.editProject });
    } else {
      setSearchParams({ 'project-id': val.value });
    }
    const valParsed = { id: val.value, title: val.label };
    dispatch(setSelectedProject(valParsed));

    const { data: project } = await getSelectedProject(val.value);

    dispatch(setSelectedProject(project));

    const payload = {
      settings_web: JSON.stringify({ ...profileSettings, lastOpenedProjectId: val.value }),
    };

    const { data } = await sendRequest({
      request: Api.editSelfProfile,
      payload,
      warnErrorText: 'while editing profile',
    });

    if (data?.id) {
      dispatch(setProfile(data));
    }
  };

  return (
    <MySelect
      data={finalProjectsOptions}
      value={selectedProjectFormatted}
      onChange={onChangeProject}
    />
  );
}

export default ProjectsSelect;

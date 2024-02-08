import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './css/index.module.scss';
import Loading from '../../../ui-kit/loading';
import sendRequest from '../../../helpers/sendRequest';
import Api from '../../../api';
import { TOOLBOX_BLOCKS } from '../../../helpers/constants';
import ToolBlock from './components/ToolBlock';
import { getToolsTypesRequest } from '../../../store/thunks/tools';
import GoBack from '../../../components/go-back';

function EditTools() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [gettingLoading, setGettingLoading] = useState(true);
  const [currentProjectTools, setCurrentProjectTools] = useState({});

  const selectedProject = useSelector((store) => store.projects.selectedProject);
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get('project-id');

  const getCurrentProjectTools = async () => {
    setGettingLoading(true);
    const { data } = await sendRequest({
      request: Api.getProjectTools,
      payload: projectId,
      warnErrorText: 'while getting project tools',
    });

    if (data?.length) {
      setCurrentProjectTools((pr) => data
        .sort((a, b) => a.order - b.order)
        .reduce((prev, curr) => {
          if (prev[curr.group]) {
            prev[curr.group].push(curr);
          } else {
            prev[curr.group] = [curr];
          }

          return prev;
        }, pr));
    }

    setGettingLoading(false);
  };

  useEffect(() => {
    if (selectedProject?.id) {
      const obj = Object.keys(TOOLBOX_BLOCKS).reduce((prev, curr) => {
        prev[curr] = [];
        return prev;
      }, {});
      setCurrentProjectTools(obj);
      dispatch(getToolsTypesRequest());
      getCurrentProjectTools().then();
    }
  }, [selectedProject?.id]);

  return (
    <div className={styles.editUsers}>
      {gettingLoading ? (
        <Loading
          height={40}
          width={40}
          wholeSpace
        />
      ) : (
        <>
          <GoBack text="Editing project tools" />
          <div className={styles.editUsersView}>
            {Object.keys(TOOLBOX_BLOCKS).map((toolKey, index) => (
              <ToolBlock
                key={index}
                index={index}
                toolKey={toolKey}
                users={selectedProject?.users}
                projectId={selectedProject.id}
                blockObject={TOOLBOX_BLOCKS[toolKey]}
                currentProjectTools={currentProjectTools}
                setCurrentProjectTools={setCurrentProjectTools}
              />
            ))}

          </div>
        </>
      )}
    </div>
  );
}

export default EditTools;

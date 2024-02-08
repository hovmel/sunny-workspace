import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from '../css/index.module.scss';
import { SHADOW_PROPERTIES, TOOLBOX_BLOCKS } from '../../../helpers/constants';
import MyButton from '../../../ui-kit/button';
import { addFrameToQueue } from '../../../store/slices/projects';
import sendRequest from '../../../helpers/sendRequest';
import Api from '../../../api';
import ToolsBlock from './ToolsBlock';
import ToolItem from './ToolItem';

function ToolsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedProject = useSelector((store) => store.projects.selectedProject);

  const [selectedProjectTools, setSelectedProjectTools] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const toolId = searchParams.get('tool-id');

  const getSelectedProjectTools = async () => {
    const { data } = await sendRequest({
      request: Api.getMyProject,
      payload: selectedProject.id,
      warnErrorText: 'while getting project tools',
    });

    if (Array.isArray(data?.tools)) {
      const list = data.tools
        .sort((a, b) => a.order - b.order)
        .reduce((prev, curr) => {
          if (prev[curr.group]) {
            prev[curr.group].push(curr);
          } else {
            prev[curr.group] = [curr];
          }

          return prev;
        }, {});

      setSelectedProjectTools(list);

      if (toolId) {
        const currentTool = data.tools.find((item) => item.id === +toolId);

        if (currentTool?.id) {
          dispatch(addFrameToQueue(currentTool));
        }
      }
    }
  };

  useEffect(() => {
    if (selectedProject?.id) {
      getSelectedProjectTools().then();
    }
  }, [selectedProject]);

  return (
    <div className={styles.toolsList}>

      {Object.keys(TOOLBOX_BLOCKS)?.map((key, index) => (
        <ToolsBlock
          key={key}
          keyName={key}
          index={index}
          selectedProjectTools={selectedProjectTools}
        />
      ))}
    </div>
  );
}

export default ToolsList;

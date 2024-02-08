import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from '../css/index.module.scss';
import { SETTINGS_STATE } from '../../../helpers/settingsState';

function ToolsBottomPart() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedProject = useSelector((store) => store.projects.selectedProject);

  const settingsState = searchParams.get('settings-state');

  const onSettingsClick = () => {
    setSearchParams({ 'project-id': searchParams.get('project-id'), 'settings-state': SETTINGS_STATE.editProject });
  };

  if (!selectedProject?.hasRoleInSelectedProject) {
    return null;
  }

  return (
    <div className={styles.toolsBottom}>
      <div className={styles.line} />
      <div className={`${styles.toolBlockTitle} ${settingsState && styles.toolBlockTitleActive}`} onClick={onSettingsClick}>
        <p className={styles.toolBlockTitleText}>
          Settings
        </p>
      </div>
    </div>
  );
}

export default ToolsBottomPart;

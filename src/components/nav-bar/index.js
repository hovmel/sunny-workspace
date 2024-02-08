import React from 'react';
import styles from './css/index.module.scss';
import ToolsList from './components/ToolsList';
import ProjectsSelect from './components/ProjectsSelect';
import ToolsBottomPart from './components/ToolsBottomPart';

function NavBar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.topPart}>
        <ProjectsSelect />
      </div>
      <div className={styles.mainPart}>
        <ToolsList />
        <ToolsBottomPart />
      </div>

    </div>
  );
}

export default NavBar;

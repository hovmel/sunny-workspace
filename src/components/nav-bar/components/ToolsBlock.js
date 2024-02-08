import React, { useState } from 'react';
import styles from '../css/index.module.scss';
import { SHADOW_PROPERTIES, TOOLBOX_BLOCKS } from '../../../helpers/constants';
import MyButton from '../../../ui-kit/button';
import ToolItem from './ToolItem';

function ToolsBlock({
  index, selectedProjectTools, keyName,
}) {
  const [isOpen, setIsOpen] = useState(true);

  const onTitleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.toolBlock}>
      <div className={styles.toolBlockTitle} onClick={onTitleClick}>
        <p className={styles.toolBlockTitleText}>
          {index + 1}
          )
          {' '}
          {TOOLBOX_BLOCKS[keyName].name}
        </p>
        <img
          src="/images/arrow_down.png" alt="V"
          className={`${styles.toolBlockTitleArrow} ${isOpen && styles.toolBlockTitleArrowDown}`}
        />
      </div>

      <div
        className={`${styles.toolBlockList} ${!isOpen && styles.toolBlockListClosed}`}
        style={{ height: isOpen ? (selectedProjectTools[keyName]?.length || 1) * 31 : 0 }}
      >
        {selectedProjectTools[keyName]?.map((tool) => (
          <ToolItem
            key={tool.id}
            tool={tool}
          />

        )) || <p className={styles.toolBlockNoTool}>There are no tools</p>}
      </div>
    </div>
  );
}

export default ToolsBlock;

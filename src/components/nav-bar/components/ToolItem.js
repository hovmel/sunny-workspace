import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../css/index.module.scss';
import { addFrameToQueue, removeFrameFromQueue, updateFrameKeyFromQueue } from '../../../store/slices/projects';
import ShadowView from '../../../ui-kit/shadow-view';
import { COLORS, SHADOW_PROPERTIES } from '../../../helpers/constants';

function ToolItem({
  tool, isActive,
}) {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const toolId = searchParams.get('tool-id');

  const framesQueue = useSelector((store) => store.projects.framesQueue);

  const isFrameInQueue = useMemo(() => framesQueue.findIndex((item) => item.id === tool.id) !== -1, [framesQueue]);

  const toolSettings = useMemo(() => JSON.parse(tool.settings), [tool]);

  const onCloseClick = (ev) => {
    ev.stopPropagation();
    if (tool.id === +toolId) {
      if (framesQueue.length > 1) {
        let otherTool = framesQueue[framesQueue.length - 1];
        if (otherTool.id === tool.id) {
          otherTool = framesQueue[framesQueue.length - 2];
        }

        setSearchParams({ 'project-id': searchParams.get('project-id'), 'tool-id': otherTool.id });
      } else {
        searchParams.delete('tool-id');
        setSearchParams(searchParams);
      }
    }
    dispatch(removeFrameFromQueue(tool.id));
  };

  const onRefreshClick = (ev) => {
    ev.stopPropagation();
    dispatch(updateFrameKeyFromQueue(tool.id));
  };

  const onToolClick = () => {
    if (tool.tool_type.title === 'URL') {
      const settings = JSON.parse(tool.settings);
      window.open(settings.baseUrl, settings.mode);
    } else if (['iFrame', 'VNC'].includes(tool.tool_type.title)) {
      setSearchParams({ 'project-id': searchParams.get('project-id'), 'tool-id': tool.id });
      dispatch(addFrameToQueue(tool));
    }
  };

  return (
    <div className={`${styles.toolBlockItem} ${(+toolId === tool.id || isActive) && styles.toolBlockItemSelected}`} onClick={onToolClick}>
      <div className={`${styles.toolBlockItemDot} ${isFrameInQueue && toolSettings.keepOpen && styles.toolBlockItemDotVisible}`} />
      <p className={styles.toolBlockItemText}>
        {tool.title}
      </p>

      {isFrameInQueue && (
      <ShadowView
        borderRadius={4}
        shadowType={SHADOW_PROPERTIES.out1}
        className={styles.toolBlockItemPanel}
      >
        <div className={styles.toolBlockItemPanelItem} onClick={onRefreshClick}>
          <img
            src="/images/panel-refresh.png"
            alt="I"
            className={styles.toolBlockItemPanelItemImg}
          />
        </div>
        <div className={styles.toolBlockItemPanelItem} onClick={onCloseClick}>
          <img
            src="/images/panel-close.png"
            alt="I"
            className={styles.toolBlockItemPanelItemImg}
          />
        </div>
      </ShadowView>
      )}
      {/* {tool.children?.length && (
      <img
        src="/images/arrow_down.png" alt="V"
        className={`${styles.toolBlockItemArrow} ${isOpen && styles.toolBlockItemArrowDown}`}
      />
      )} */}
    </div>
  );
}

export default ToolItem;

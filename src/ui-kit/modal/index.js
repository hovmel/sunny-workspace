import React from 'react';
import './css/index.scss';
import Modal from 'react-modal';
import ShadowView from '../shadow-view';
import { SHADOW_PROPERTIES } from '../../helpers/constants';

function MyModal({
  isOpen, closeFunction, children, style, closeOnPressOutside = true,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeOnPressOutside ? closeFunction : undefined}
      style={{ overlay: styles.overlay, content: { ...styles.content, ...style } }}
      closeTimeoutMS={200}
    >
      <ShadowView className="ReactModal__Overlay_my_content" shadowType={SHADOW_PROPERTIES.out1}>
        {children}
      </ShadowView>
    </Modal>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  content: {
    position: 'absolute',
    height: 'fit-content',
    width: 'fit-content',
    background: 'rgba(255,255,255,0)',
    overflow: 'show',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '12px',
    border: 0,
    padding: '0',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default MyModal;

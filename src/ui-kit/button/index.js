import React, { useEffect, useState } from 'react';
import styles from './css/index.module.scss';
import MyLoading from '../loading';
import ShadowView from '../shadow-view';
import { SHADOW_PROPERTIES } from '../../helpers/constants';

function MyButton({
  loading,
  onClick,
  text,
  iconUri,
  backgroundColor,
  borderRadius = 32,
  InnerComponent,
  className = '',
  textClassName = '',
  iconClassName = '',
  loadingEqualsDisabled = true,
  disabled,
}) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isDisabled = (loading && loadingEqualsDisabled) || disabled;

  const onMouseDown = () => {
    setIsPressed(!isDisabled && true);
  };
  const onMouseUp = () => {
    setIsPressed(false);
  };
  const onMouseEnter = () => {
    setIsHovered(!isDisabled && true);
  };
  const onMouseOut = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  return (
    <ShadowView
      borderRadius={borderRadius}
      backgroundColor={backgroundColor}
      shadowType={isPressed ? SHADOW_PROPERTIES.out1 : isHovered ? SHADOW_PROPERTIES.out3 : SHADOW_PROPERTIES.out2}
      onClick={!loading && !disabled ? onClick : undefined}
      className={`${isDisabled && styles.disabled_button} ${styles.button_div} ${className}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      onMouseOut={onMouseOut}
    >
      {InnerComponent || (
        <>
          <MyLoading
            className={styles.loading}
            visible={!!loading}
          />

          {text && <p className={`${textClassName} ${loading && styles.disabled} ${styles.button_text}`}>{text}</p>}
          {iconUri && (
          <img
            src={iconUri}
            alt=""
            className={`${iconClassName} ${loading && styles.disabled} ${styles.button_icon}`}
          />
          )}
        </>
      )}

    </ShadowView>
  );
}

export default MyButton;

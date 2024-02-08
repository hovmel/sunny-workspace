import React, { useEffect, useState } from 'react';
import styles from './css/index.module.scss';
import MyLoading from '../loading';
import ShadowView from '../shadow-view';
import { COLORS, SHADOW_PROPERTIES } from '../../helpers/constants';

function MyOrangeButton({
  loading,
  onClick,
  text,
  iconUri,
  className = '',
  textClassName = '',
  iconClassName = '',
  loadingEqualsDisabled = true,
  disabled,
}) {
  const isDisabled = (loading && loadingEqualsDisabled) || disabled;

  return (
    <div
      onClick={!loading && !disabled ? onClick : undefined}
      className={`${isDisabled && styles.disabled_button} ${styles.button_div} ${className}`}
    >
      <MyLoading
        className={styles.loading}
        visible={!!loading}
        color={COLORS.main}
      />

      {iconUri && (
      <img
        src={iconUri}
        alt=""
        className={`${iconClassName} ${loading && styles.disabled} ${styles.button_icon}`}
      />
      )}
      {text && <p className={`${textClassName} ${loading && styles.disabled} ${styles.button_text}`}>{text}</p>}
    </div>
  );
}

export default MyOrangeButton;

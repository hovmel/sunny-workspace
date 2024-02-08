import React from 'react';
import styles from './css/index.module.scss';
import { COLORS } from '../../helpers/constants';
import MyButton from '../button';
import MyLoading from '../loading';

function MyRoundButton({
  iconUri,
  className,
  iconClassName,
  isBackgroundActive = true,
  loading,
  loadingEqualsDisabled = true,
  disabled,
  ...p
}) {
  const isDisabled = (loading && loadingEqualsDisabled) || disabled;

  return (
    <MyButton
      {...p}
      loading={loading}
      disabled={disabled}
      loadingEqualsDisabled={loadingEqualsDisabled}
      backgroundColor="#fff"
      className={`${styles.wrapper} ${className}`}
      InnerComponent={(
        <div className={`${styles.inner} ${(isBackgroundActive && !isDisabled) && styles.innerActive}`}>
          {loading ? <MyLoading color={COLORS.main} /> : (
            <img
              className={`${styles.icon} ${iconClassName}`}
              src={iconUri}
              alt=""
            />
          )}
        </div>
      )}
    />
  );
}

export default MyRoundButton;

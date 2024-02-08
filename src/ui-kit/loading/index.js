import React from 'react';
import { Bars } from 'react-loader-spinner';
import styles from './css/index.module.scss';
import { COLORS } from '../../helpers/constants';

function MyLoading({
  height = 20, width = 20, className, visible, color = COLORS.darkOrange, secondaryColor, wholeSpace,
}) {
  // eslint-disable-next-line react/no-unstable-nested-components
  function Component() {
    return (
      <Bars
        height={height}
        width={width}
        color={color}
        wrapperClass={className}
        visible={visible}
        ariaLabel="bars-loading"
        secondaryColor={secondaryColor || color}
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    );
  }

  return (
    wholeSpace ? (
      <div className={styles.whole_space_wrapper}>
        <Component />
      </div>
    ) : (
      <Component />
    )

  );
}

export default MyLoading;

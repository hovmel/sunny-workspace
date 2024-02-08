import React from 'react';
import styles from './css/index.module.scss';
import TopBar from '../top-bar';
import NavBar from '../nav-bar';
import GoBack from '../go-back';

function Wrapper({
  children,
  withNavBar = true,
  withTopBar = true,
  withGoBack = true,
}) {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.mainRow} ${!withTopBar && styles.mainRow_whole_height}`}>
        {withNavBar && (
        <div className={styles.navBar}>
          <NavBar />
        </div>
        )}

        <div className={`${styles.rightPart} ${!withNavBar && styles.rightPartWholePart}`}>
          {withTopBar && (
            <div className={styles.topBar}>
              <TopBar />
            </div>
          )}

          <div className={`${styles.container} ${!withTopBar && styles.containerWholePart}`}>
            {withGoBack && (
              <GoBack />
            )}

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wrapper;

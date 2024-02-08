import React from 'react';
import styles from './css/index.module.scss';

function MyCheckbox({
  value, onChange, rightComponent, className, error, setError, returnFinalVal,
}) {
  const onChangeValue = () => {
    if (returnFinalVal) {
      onChange(!value);
      return;
    }
    onChange((prev) => !prev);
    if (error) {
      setError(false);
    }
  };

  return (
    <div className={`${className} ${styles.wrapper}`}>
      {error && <p className={styles.errorText}>*</p>}
      <div onClick={onChangeValue} className={styles.main}>
        <div className={value ? styles.mainFull : ''} />
      </div>
      <div className={styles.rightPart}>
        {rightComponent}
      </div>
    </div>
  );
}

export default MyCheckbox;

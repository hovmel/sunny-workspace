import React from 'react';
import styles from './css/index.module.scss';

function MyInput({
  wrapperClassName = '',
  labelClassName = '',
  infoClassName = '',
  className = '',

  label,
  innerRef,
  id,
  error,
  info,
  textarea,
  placeholder,
  disabled,
  type = 'text',
  withoutErrorHeight,
  ...p
}) {
  return (
    <div className={`${styles.input_div} ${wrapperClassName}`}>
      {label && <label className={`${styles.label} ${error && styles.error_label} ${labelClassName}`}>{label}</label>}
      {textarea ? (
        <textarea
          className={`${styles.input} ${className} ${error && styles.error}`}
          placeholder={placeholder}
          {...p}
        />
      ) : (
        <input
          type={type}
          className={`${styles.input} ${type === 'date' && styles.date_input} ${className} ${error && styles.error_input}`}
          ref={innerRef}
          placeholder={placeholder}
          disabled={disabled}
          {...p}
        />
      )}
      {error ? <p className={styles.error}>{error}</p> : info ? <p className={`${styles.info} ${infoClassName}`}>{info}</p> : <p className={`${styles.error} ${styles.errorHidden}`}>{!withoutErrorHeight && 'H'}</p>}
    </div>
  );
}

export default MyInput;

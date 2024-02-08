import React, { useRef } from 'react';
import Select from 'react-select';
import styles from './css/index.module.scss';
import './css/index.scss';

function MySelect({
  wrapperClassName = '',
  labelClassName = '',
  infoClassName = '',
  className = '',

  label,
  innerRef,
  id,
  error,
  info,
  placeholder = '',
  type = 'text',
  data,
  ...p
}) {
  return (
    <div className={wrapperClassName}>
      {label && <label className={`${styles.label} ${error && styles.error_label} ${labelClassName}`}>{label}</label>}
      <Select
        options={data}
        classNamePrefix="my-select"
        placeholder={placeholder}
        {...p}
      />
      {error ? <p className={styles.error}>{error}</p> : info ? <p className={`${styles.info} ${infoClassName}`}>{info}</p> : null}
    </div>
  );
}

export default MySelect;

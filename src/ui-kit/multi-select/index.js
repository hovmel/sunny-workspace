import React, { useRef } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import styles from './css/index.module.scss';
import './css/index.scss';

const animatedComponents = makeAnimated();

function MyMultiSelect({
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
    <div className={className}>
      {label && <label className={`${styles.label} ${error && styles.error_label} ${labelClassName}`}>{label}</label>}
      <Select
        isMulti
        components={animatedComponents}
        options={data}
        classNamePrefix="my-multi-select"
        placeholder={placeholder}
        {...p}
      />
      {error ? <p className={styles.error}>{error}</p> : info ? <p className={`${styles.info} ${infoClassName}`}>{info}</p> : null}
    </div>
  );
}

export default MyMultiSelect;

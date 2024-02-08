import React, { useRef } from 'react';
import { TagsInput } from 'react-tag-input-component';
import styles from './css/index.module.scss';

function MyTagInput({
  wrapperClassName = '',
  labelClassName = '',
  infoClassName = '',
  className = '',

  label,
  innerRef,
  id,
  error,
  info,
  placeholder,
  type = 'text',
  ...p
}) {
  return (
    <div className={className}>
      {label && <label className={`${styles.label} ${error && styles.error_label} ${labelClassName}`}>{label}</label>}

      <div className={`${styles.input} ${error && styles.error_input}`}>
        <TagsInput
          {...p}
          placeHolder={placeholder}
          separators={[' ', 'Enter', 'Tab', ',']}
        />
      </div>

      {error ? <p className={styles.error}>{error}</p> : info ? <p className={`${styles.info} ${infoClassName}`}>{info}</p> : null}

    </div>

  );
}

export default MyTagInput;

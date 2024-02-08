import React from 'react';
import styles from './css/index.module.scss';

function MyRadioSelect({
  wrapperClassName = '',
  data,
  value = {},
  onChange,
}) {
  const onClick = (item) => () => {
    if (item.value !== value.value) {
      onChange(item);
    }
  };

  return (
    <div className={wrapperClassName}>
      {data?.map((item) => (
        <div
          key={item.value}
          className={styles.buttonRow}
          onClick={onClick(item)}
        >
          <div className={`${styles.buttonRowCircle} ${value.value === item.value && styles.buttonRowCircleActive}`}>
            {value.value === item.value && <div className={styles.buttonRowCircleInner} />}
          </div>

          <p className={styles.buttonRowText}>{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export default MyRadioSelect;

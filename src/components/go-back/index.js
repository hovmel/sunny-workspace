import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/index.module.scss';
import RoundButton from '../../ui-kit/round-button';

function GoBack({ text }) {
  const navigate = useNavigate();

  const onGoBack = () => {
    navigate(-1);
  };
  return (
    <div className={styles.goBack}>
      <RoundButton
        onClick={onGoBack}
        iconUri="/images/arrow-left.png"
        iconClassName={styles.goBackIcon}
      />
      <p className={styles.goBackText}>{text}</p>
    </div>

  );
}

export default GoBack;

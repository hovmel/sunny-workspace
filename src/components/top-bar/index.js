import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './css/index.module.scss';

function TopBar() {
  const navigate = useNavigate();
  const profile = useSelector((store) => store.profile.profile);
  const selectedTool = useSelector((store) => store.projects.selectedTool);

  const onProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.toolTitle}>{selectedTool?.title}</p>

      <div className={styles.profilePart} onClick={onProfileClick}>
        <p className={styles.name}>{`${profile?.first_name} ${profile?.last_name}`}</p>
        <img
          className={styles.photo}
          src={profile.photo || '/images/profile.png'}
          alt="Photo"
        />
      </div>

    </div>
  );
}

export default TopBar;

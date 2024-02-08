import React from 'react';
import styles from '../css/index.module.scss';
import MyRoundButton from '../../../../ui-kit/round-button';

function UserItem({
  user,
  setSelectedUser,
  openEditUserModal,
  openDeleteUserModal,
}) {
  const onEditClick = () => {
    setSelectedUser(user);
    openEditUserModal();
  };
  const onDeleteClick = () => {
    setSelectedUser(user);
    openDeleteUserModal();
  };

  return (
    <div className={styles.userItem}>
      <div className={styles.userItemBlock}>
        <p className={styles.userItemBlockTitle}>Email</p>
        <p className={styles.userItemBlockText}>
          {user.login}
        </p>
      </div>
      <div className={styles.userItemBlock}>
        <p className={styles.userItemBlockTitle}>Name</p>
        <p className={styles.userItemBlockText}>
          {user.first_name ? `${user.first_name} ${user.last_name}` : '_____'}
        </p>
      </div>
      <div className={styles.userItemBlock}>
        <p className={styles.userItemBlockTitle}>Position</p>
        <p className={styles.userItemBlockText}>
          {user.position || '_____'}
        </p>
      </div>
      <div className={styles.userItemBlock}>
        <p className={styles.userItemBlockTitle}>Policy</p>
        <p className={styles.userItemBlockText}>
          {user.policy?.title || '_____'}
        </p>
      </div>
      <div className={styles.userItemBlock}>
        <p className={styles.userItemBlockTitle}>Permissions</p>
        <p className={styles.userItemBlockText}>
          {user.permissions?.length ? user.permissions.map((permission) => `${permission.title} `) : '_____'}
        </p>
      </div>
      <div className={styles.userItemBlock}>
        <p className={styles.userItemBlockTitle}>Tools</p>
        <p className={styles.userItemBlockText}>
          {user.tools?.length ? user.tools.map((tool) => `${tool.title} `) : '_____'}
        </p>
      </div>

      <div className={styles.userItemButtons}>
        <MyRoundButton
          className={styles.userItemButtonsFirst}
          iconUri="/images/edit.png"
          onClick={onEditClick}
        />
        <MyRoundButton
          iconUri="/images/delete.png"
          onClick={onDeleteClick}
          isBackgroundActive={false}
        />
      </div>

    </div>
  );
}

export default UserItem;

/* {
            "id": 3,
            "login": "user1@users.com",
            "first_name": "user1",
            "last_name": "11",
            "position": null,
            "policy": {
                "id": 15,
                "title": "Default policy",
                "is_default": true
            },
            "permissions": []
        }, */

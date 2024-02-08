import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './css/index.module.scss';
import Wrapper from '../../components/wrapper';
import useInputState from '../../helpers/hooks/useInputState';
import ShadowView from '../../ui-kit/shadow-view';
import { SHADOW_PROPERTIES } from '../../helpers/constants';
import MyInput from '../../ui-kit/input';
import MyRoundButton from '../../ui-kit/round-button';
import Api from '../../api';
import { logoutReducer, setProfile } from '../../store/slices/profile';
import sendRequest from '../../helpers/sendRequest';
import MyButton from '../../ui-kit/button';
import MyModal from '../../ui-kit/modal';
import MyOrangeButton from '../../ui-kit/orange-button';
import LocalStorageServices, { STORAGE_KEYS } from '../../helpers/LocalStorageServices';
import MyLoading from '../../ui-kit/loading';

function Profile() {
  const dispatch = useDispatch();
  const photoRef = useRef();
  const profile = useSelector((store) => store.profile.profile);

  const [firstName, setFirstName, firstNameError, setFirstNameError] = useInputState();
  const [lastName, setLastName, lastNameError, setLastNameError] = useInputState();
  const [passwordOld, setPasswordOld, passwordOldError, setPasswordOldError] = useInputState();
  const [passwordNew, setPasswordNew, passwordNewError, setPasswordNewError] = useInputState();
  const [passwordNewSecond, setPasswordNewSecond, passwordNewSecondError, setPasswordNewSecondError] = useInputState();

  const [firstNameLoading, setFirstNameLoading] = useState(false);
  const [lastNameLoading, setLastNameLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalState, setModalState] = useState('');

  const updateProfile = async (payload, setLoading) => {
    const { data } = await sendRequest({
      request: Api.editSelfProfile,
      payload,
      warnErrorText: 'while updating self profile',
      setLoading,
    });

    if (data?.id) {
      dispatch(setProfile(data));
      LocalStorageServices.setItem(STORAGE_KEYS.profile, data);
    }
  };

  const changeFirstName = async (ev) => {
    ev.preventDefault();
    if (!firstName.trim()) {
      setFirstNameError('Name is required');
      return;
    }

    updateProfile({ first_name: firstName.trim() }, setFirstNameLoading).then();
  };

  const changeLastName = async (ev) => {
    ev.preventDefault();
    if (!lastName.trim()) {
      setLastNameError('Last Name is required');
      return;
    }

    updateProfile({ last_name: lastName.trim() }, setLastNameLoading).then();
  };

  const changePassword = async () => {
    let flag = false;
    if (!passwordOld) {
      setPasswordOldError('Old password is required');
      flag = true;
    }
    if (!passwordNew) {
      setPasswordNewError('New password is required');
      flag = true;
    } else if (passwordNew.length < 6) {
      setPasswordNewError('Minimum 6 characters');
      flag = true;
    }
    if (passwordNew !== passwordNewSecond) {
      setPasswordNewSecondError('Passwords do not match');
      flag = true;
    }

    if (flag) {
      return;
    }

    const payload = {
      password: passwordOld,
      password_new: passwordNew,
    };

    const { data } = await sendRequest({
      request: Api.editSelfProfile,
      payload,
      warnErrorText: 'while updating profile password',
      setLoading: setPasswordLoading,
      setError: passwordUpdatingError,
    });

    if (data?.id) {
      setPasswordOld('', true);
      setPasswordNew('', true);
      setPasswordNewSecond('', true);
    }
  };

  const passwordUpdatingError = (err) => {
    if (err?.error === 'invalid_password') {
      setPasswordOldError('Wrong password');
    }
  };

  const onPhotoEditClick = () => {
    photoRef?.current?.click();
  };

  const onFileChoose = async (val) => {
    if (!val?.target?.files?.length) return;

    setPhotoLoading(true);
    const formData = new FormData();
    formData.append('file', val.target.files[0]);

    const { data } = await sendRequest({
      request: Api.editSelfProfilePhoto,
      payload: formData,
      warnErrorText: 'while updating self profile photo',
    });

    if (data?.id) {
      dispatch(setProfile(data));
      LocalStorageServices.setItem(STORAGE_KEYS.profile, data);
      setTimeout(() => setPhotoLoading(false), 400);
    }
  };

  const logout = async () => {
    await Api.logout();
    LocalStorageServices.removeAll();
    dispatch(logoutReducer());
    location.reload();
  };
  const deleteAccount = async () => {
    await Api.deleteProfile();
    LocalStorageServices.removeAll();
    dispatch(logoutReducer());
    location.reload();
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setModalState(''), 400);
  };

  useEffect(() => {
    if (profile?.id) {
      setFirstName(profile.first_name);
      setLastName(profile.last_name);
    }
  }, [profile]);

  return (
    <Wrapper withTopBar={false} withNavBar={false}>
      <div className={styles.wrapper}>
        <ShadowView
          shadowType={SHADOW_PROPERTIES.out2}
          className={styles.photoWrapper}
          borderRadius={150}
        >
          <img
            className={styles.photo}
            src={profile.photo || '/images/profile.png'}
            alt="F"
          />
          <div className={styles.photoEdit} onClick={onPhotoEditClick}>
            <img
              src="/images/edit-profile.png"
              alt="E"
              className={styles.photoEditIcon}
            />
            <input
              type="file"
              ref={photoRef}
              onChange={onFileChoose}
              style={{ display: 'none' }}
              accept="image/jpeg,image/png"
            />
          </div>

          {photoLoading && (
            <div className={styles.photoEditLoading}>
              <MyLoading
                wholeSpace width={40}
                height={40}
              />
            </div>
          )}
        </ShadowView>

        <p className={styles.fullName}>{`${profile.first_name} ${profile.last_name}`}</p>

        <form className={styles.nameInputRow} onSubmit={changeFirstName}>
          <MyInput
            value={firstName}
            onChange={setFirstName}
            error={firstNameError}
            label="First name"
          />

          <MyRoundButton
            loading={firstNameLoading}
            disabled={firstName.trim() === profile.first_name}
            iconUri="/images/done.png"
            className={styles.nameInputButton}
            onClick={changeFirstName}
          />
        </form>

        <form className={styles.nameInputRow} onSubmit={changeLastName}>
          <MyInput
            value={lastName}
            onChange={setLastName}
            error={lastNameError}
            label="Last name"
          />

          <MyRoundButton
            loading={lastNameLoading}
            disabled={lastName.trim() === profile.last_name}
            iconUri="/images/done.png"
            className={styles.nameInputButton}
            onClick={changeLastName}
          />
        </form>

        <div className={styles.line} />

        <div>
          <div className={styles.nameInputRow}>
            <MyInput
              value={passwordOld}
              onChange={setPasswordOld}
              error={passwordOldError}
              label="Old password"
              type="password"
            />
          </div>
          <div className={styles.nameInputRow}>
            <MyInput
              value={passwordNew}
              onChange={setPasswordNew}
              error={passwordNewError}
              label="New password"
              type="password"
            />
          </div>
          <div className={styles.nameInputRow}>
            <MyInput
              value={passwordNewSecond}
              onChange={setPasswordNewSecond}
              error={passwordNewSecondError}
              label="New password repeat"
              type="password"
            />
          </div>

          <MyButton
            text="Change password"
            loading={passwordLoading}
            onClick={changePassword}
            className={styles.passwordSaveButton}
          />
        </div>

        <div className={`${styles.line} ${styles.lineSecond}`} />

        <div className={styles.bottomButtonsRow}>
          <MyButton
            text="Delete account"
            onClick={() => {
              setModalState('delete');
              setIsModalVisible(true);
            }}
          />
          <MyButton
            text="Log out"
            onClick={() => {
              setModalState('logout');
              setIsModalVisible(true);
            }}
          />
        </div>

      </div>

      <MyModal
        isOpen={isModalVisible}
        closeFunction={closeModal}
      >
        <div className={styles.modalWrapper}>
          <p className={styles.modalWrapperText}>
            {modalState === 'delete'
              ? 'Are you sure you want to irrevocably delete your account?'
              : 'Are you sure you want to log out?'}
          </p>
          <div className={styles.modalWrapperButtonsRow}>
            <MyButton
              text="Cancel"
              className={styles.modalWrapperButton}
              onClick={closeModal}
            />
            <MyOrangeButton
              text="Yes"
              className={styles.modalWrapperButton}
              onClick={modalState === 'delete' ? deleteAccount : logout}
            />
          </div>
        </div>
      </MyModal>
    </Wrapper>
  );
}

export default Profile;

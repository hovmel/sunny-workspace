import React, { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import { useDispatch } from 'react-redux';
import browserSignature from 'browser-signature';
import { Link } from 'react-router-dom';
import styles from './css/index.module.scss';
import ShadowView from '../../../ui-kit/shadow-view';
import { REGEXP, SHADOW_PROPERTIES } from '../../../helpers/constants';
import MyInput from '../../../ui-kit/input';
import useInputState from '../../../helpers/hooks/useInputState';
import MyButton from '../../../ui-kit/button';
import hashPassword from '../../../helpers/hashPassword';
import sendRequest from '../../../helpers/sendRequest';
import Api from '../../../api';
import { setAccessToken, setProfile, setRefreshToken } from '../../../store/slices/profile';
import LocalStorageServices, { STORAGE_KEYS } from '../../../helpers/LocalStorageServices';

function Registration() {
  const dispatch = useDispatch();
  const [email, setEmail, emailError, setEmailError] = useInputState();
  const [firstName, setFirstName, firstNameError, setFirstNameError] = useInputState();
  const [lastName, setLastName, lastNameError, setLastNameError] = useInputState();
  const [password, setPassword, passwordError, setPasswordError] = useInputState();
  const [newPassword, setNewPassword, newPasswordError, setNewPasswordError] = useInputState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const checkErrors = () => {
    let flag = false;
    if (!REGEXP.email.test(email)) {
      setEmailError('Set valid email');
      flag = true;
    }
    if (!firstName.trim()) {
      setFirstNameError('Name is required');
      flag = true;
    }
    if (!lastName.trim()) {
      setLastNameError('Last Name is required');
      flag = true;
    }
    if (password.length < 6) {
      setPasswordError('Minimum 6 characters');
      flag = true;
    }
    if (newPassword !== password) {
      setNewPasswordError('Passwords do not match');
      flag = true;
    }

    return flag;
  };

  const onRegister = async (ev) => {
    ev.preventDefault();
    const isError = checkErrors();
    if (isError) {
      return;
    }

    const payload = {
      login: email,
      password: hashPassword(email, password),
      first_name: firstName,
      last_name: lastName,
    };

    const { data } = await sendRequest({
      request: Api.register,
      payload,
      warnErrorText: 'while registering',
      setLoading,
      setError,
    });

    const fingerprint = browserSignature();

    if (data?.result === 'success') {
      const loginPayload = {
        login: email,
        password: hashPassword(email, password),
        push_ident: '',
        fingerprint,
      };

      const { data: loginData } = await sendRequest({
        request: Api.login,
        payload: loginPayload,
        warnErrorText: 'while logging',
        setLoading,
        setError,
      });

      if (loginData?.user) {
        const { accessToken, refreshToken, user } = loginData;

        dispatch(setAccessToken(accessToken));
        dispatch(setRefreshToken(refreshToken));
        dispatch(setProfile(user));
        LocalStorageServices.setItem(STORAGE_KEYS.accessToken, accessToken);
        LocalStorageServices.setItem(STORAGE_KEYS.refreshToken, refreshToken);
        LocalStorageServices.setItem(STORAGE_KEYS.profile, user);
      }
    }
  };

  useEffect(() => {
    if (error?.error === 'login_already_exists') {
      setEmailError('This email is already used');
    }
  }, [error]);

  return (
    <ShadowView
      className={styles.register_block}
      shadowType={SHADOW_PROPERTIES.out2}
    >
      <div className={styles.top_block}>
        <form className={styles.inputs_block} onSubmit={onRegister}>
          <p className={styles.register_title}>Registration</p>

          <MyInput
            label="Name"
            placeholder="John"
            value={firstName}
            onChange={setFirstName}
            error={firstNameError}
            wrapperClassName={styles.register_input}
          />
          <MyInput
            label="Last Name"
            placeholder="Doe"
            value={lastName}
            onChange={setLastName}
            error={lastNameError}
            wrapperClassName={styles.register_input}
          />
          <div className={styles.line} />
          <MyInput
            label="Email"
            placeholder="yourlogin@gmail.com"
            value={email}
            onChange={setEmail}
            error={emailError}
            wrapperClassName={styles.register_input}
          />
          <MyInput
            label="Password"
            placeholder="********"
            value={password}
            onChange={setPassword}
            error={passwordError}
            wrapperClassName={styles.register_input}
            type="password"
          />
          <MyInput
            label="Repeat Password"
            placeholder="********"
            value={newPassword}
            onChange={setNewPassword}
            error={newPasswordError}
            wrapperClassName={styles.register_input}
            type="password"
          />
          <button type="submit" style={{ display: 'none' }} />
        </form>
        <div className={styles.register_icon}>
          <ReactSVG
            src="/images/login_icon.svg"
            wrapper="svg"
          />
        </div>
      </div>

      <div className={styles.bottom_block}>
        <MyButton
          text="Register"
          onClick={onRegister}
          loading={loading}
          className={styles.bottom_button}
        />

        <Link to="/login" className={styles.to_login}>Already have an account?</Link>
      </div>
    </ShadowView>
  );
}

export default Registration;

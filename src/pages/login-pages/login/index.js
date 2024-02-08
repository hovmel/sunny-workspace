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

function Login() {
  const dispatch = useDispatch();
  const [email, setEmail, emailError, setEmailError] = useInputState();
  const [password, setPassword, passwordError, setPasswordError] = useInputState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const checkErrors = () => {
    let flag = false;
    if (!email) {
      setEmailError('Set email');
      flag = true;
    }
    if (!password) {
      setPasswordError('Set password');
      flag = true;
    }

    return flag;
  };

  const onLogin = async (ev) => {
    ev.preventDefault();
    const isError = checkErrors();
    if (isError) {
      return;
    }

    const fingerprint = browserSignature();

    const payload = {
      login: email,
      password: hashPassword(email, password),
      push_ident: '',
      fingerprint,
    };

    const { data } = await sendRequest({
      request: Api.login,
      payload,
      warnErrorText: 'while logging',
      setLoading,
      setError,
    });

    if (data?.user) {
      const { accessToken, refreshToken, user } = data;

      dispatch(setProfile(user));
      dispatch(setAccessToken(accessToken));
      dispatch(setRefreshToken(refreshToken));
      LocalStorageServices.setItem(STORAGE_KEYS.profile, user);
      LocalStorageServices.setItem(STORAGE_KEYS.accessToken, accessToken);
      LocalStorageServices.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    }
  };

  useEffect(() => {
    if (error?.error === 'login_not_found') {
      setEmailError('The user is not found');
    } else if (error?.error === 'invalid_password') {
      setPasswordError('Password is invalid');
    }
  }, [error]);

  return (
    <ShadowView
      className={styles.register_block}
      shadowType={SHADOW_PROPERTIES.out2}
    >
      <div className={styles.top_block}>
        <form className={styles.inputs_block} onSubmit={onLogin}>
          <p className={styles.register_title}>Login</p>
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
          <div className={styles.line} />
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
          text="Login"
          onClick={onLogin}
          loading={loading}
          className={styles.bottom_button}
        />

        <Link to="/registration" className={styles.to_login}>Do not have an account?</Link>
      </div>
    </ShadowView>
  );
}

export default Login;

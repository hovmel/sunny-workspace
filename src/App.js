import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router';
import { VncScreen } from 'react-vnc';
import LocalStorageServices, { STORAGE_KEYS } from './helpers/LocalStorageServices';
import { setAccessToken, setProfile, setRefreshToken } from './store/slices/profile';
import UnprotectedRoutes from './navigation/UnprotectedRoutes';
import Registration from './pages/login-pages/registration';
import ProtectedRoutes from './navigation/ProtectedRoutes';
import Login from './pages/login-pages/login';
import Dashboard from './pages/dashboard';
import { getSelfProfileRequest } from './store/thunks/profile';
import Profile from './pages/profile';

function App() {
  const ref = useRef();
  const dispatch = useDispatch();
  const accessToken = useSelector((store) => store.profile.accessToken);
  const user = useSelector((store) => store.profile.profile);
  const [isReady, setReady] = useState(false);

  const isAuthorized = accessToken && user?.id;

  useEffect(() => {
    const accessTokenFromStorage = LocalStorageServices.getItem(STORAGE_KEYS.accessToken);
    const refreshTokenFromStorage = LocalStorageServices.getItem(STORAGE_KEYS.refreshToken);
    const userFromStorage = LocalStorageServices.getItem(STORAGE_KEYS.profile);
    if (accessTokenFromStorage) {
      dispatch(setAccessToken(accessTokenFromStorage));
      dispatch(setProfile(userFromStorage));
      dispatch(setRefreshToken(refreshTokenFromStorage));
      dispatch(getSelfProfileRequest());
    }

    setReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <Routes>
      <Route element={(<UnprotectedRoutes authorizedFirstScreen="/" isAuthorized={isAuthorized} />)}>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Route>

      <Route element={<ProtectedRoutes isAuthorized={isAuthorized} />}>

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route
        path="*"
        element={(
          <Navigate to={isAuthorized ? '/dashboard' : '/login'} replace />
        )}
      />
    </Routes>
  /* <div>
      <VncScreen
        url="ws://aquris.aiwess.com:12659"
        scaleViewport
        background="#000000"
        style={{
          width: '75vw',
          height: '75vh',
        }}
        rfbOptions={{
          credentials: {
            password: prompt('password aper:'),
          },
        }}
      />
    </div> */
  );
}

export default App;

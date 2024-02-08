import { Outlet, Navigate } from 'react-router';

export default function ({ isAuthorized }) {
  return isAuthorized ? (
    <Outlet />
  ) : <Navigate to="/login" replace />;
}

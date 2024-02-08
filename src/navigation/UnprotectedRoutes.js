import { Outlet, Navigate } from 'react-router';

export default function ({ isAuthorized, authorizedFirstScreen }) {
  return !isAuthorized ? <Outlet /> : <Navigate to={authorizedFirstScreen} replace />;
}

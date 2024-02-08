import React from 'react';
import { useNavigate } from 'react-router-dom';

export default () => {
  const navigate = useNavigate();
  return (pathname, params) => navigate(
    { pathname, search: convertObjectToParams(params), replace: false },
  );
};

export const convertObjectToParams = (obj) => {
  let result = '?';
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value === undefined || value === null || value === '') {
      return;
    }
    result += `${key}=${value}&`;
  });

  return result.slice(0, result.length - 1);
};

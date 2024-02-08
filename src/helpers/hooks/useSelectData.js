import React, { useMemo } from 'react';
import _ from 'lodash';

const UseSelectData = (data, { id, label } = {}) => useMemo(() => {
  id = id || 'id';
  label = label || 'title';
  if (!data?.length) return [];
  return data.map((item) => ({ value: _.get(item, id), label: _.get(item, label) }));
}, [data]);

export default UseSelectData;

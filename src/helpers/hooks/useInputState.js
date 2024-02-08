import { useState } from 'react';

const UseInputState = (defaultValue = '') => {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState('');

  const handleValue = (ev, setInstantly = false) => {
    if (setInstantly) {
      setValue(ev);
    } else {
      if (!ev) {
        return false;
      }

      if (ev?.target) {
        setValue(ev.target.value);
      } else {
        setValue(ev);
      }
    }

    if (error) {
      setError('');
    }
  };
  return [value, handleValue, error, setError];
};

export default UseInputState;

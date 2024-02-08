import React, { useEffect, useState } from 'react';
import styles from '../css/index.module.scss';
import MyInput from '../../../../ui-kit/input';
import useInputState from '../../../../helpers/hooks/useInputState';
import MyRadioSelect from '../../../../ui-kit/radio-select';
import { URL_MODE_DATA } from '../../../../helpers/local-data/radio-buttons-data';

function UrlPart({ settings, setSettings }) {
  const setBaseUrl = (ev) => {
    setSettings((prev) => ({ ...prev, baseUrl: ev.target.value }));
  };

  const setMode = (val) => {
    setSettings((prev) => ({ ...prev, mode: val.value }));
  };

  return (
    <div className={styles.toolSettings}>
      <div className={styles.toolSettingsRow}>
        <p className={styles.toolSettingsTitle}>Base URL</p>
        <MyInput
          wrapperClassName={styles.toolSettingsMain}
          value={settings.baseUrl}
          onChange={setBaseUrl}
          placeholder="https://office.aiwess.com/jira?project=one&filter=open"
        />
      </div>
      <div className={styles.toolSettingsRow}>
        <p className={styles.toolSettingsTitle}>Mode</p>
        <MyRadioSelect
          onChange={setMode}
          value={URL_MODE_DATA.find((item) => item.value === settings.mode)}
          data={URL_MODE_DATA}
        />
      </div>
    </div>
  );
}

export default UrlPart;

/* {
    baseUrl: string,
    mode: '_blank', '_top', '_self'
} */

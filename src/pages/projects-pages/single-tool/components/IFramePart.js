import React, { useEffect, useState } from 'react';
import styles from '../css/index.module.scss';
import MyInput from '../../../../ui-kit/input';
import useInputState from '../../../../helpers/hooks/useInputState';
import MyRadioSelect from '../../../../ui-kit/radio-select';
import { URL_MODE_DATA } from '../../../../helpers/local-data/radio-buttons-data';
import MyCheckbox from '../../../../components/checkbox';

function IFramePart({ settings, setSettings }) {
  const setKeepOpen = (val) => {
    setSettings((prev) => ({ ...prev, keepOpen: val }));
  };

  const setBaseUrl = (ev) => {
    setSettings((prev) => ({ ...prev, baseUrl: ev.target.value }));
  };

  return (
    <div className={styles.toolSettings}>
      <div className={styles.toolSettingsRow}>
        <p className={styles.toolSettingsTitle}>Keep open</p>
        <MyCheckbox
          className={styles.toolSettingsMain}
          value={settings.keepOpen}
          onChange={setKeepOpen}
          returnFinalVal
          rightComponent="Do not close the iFrame window if the user switches to another tab. Allows you to save state if the user navigates to an internal section in the iFrame or works with form filling"
        />
      </div>
      <div className={styles.toolSettingsRow}>
        <p className={styles.toolSettingsTitle}>Base URL</p>
        <MyInput
          wrapperClassName={styles.toolSettingsMain}
          value={settings.baseUrl || ''}
          onChange={setBaseUrl}
          placeholder="https://office.aiwess.com/jira?project=one&filter=open"
        />
      </div>

    </div>
  );
}

export default IFramePart;

/* {
    keepOpen: boolean,
    baseUrl: string,
} */

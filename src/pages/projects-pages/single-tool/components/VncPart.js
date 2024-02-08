import React, { useEffect, useState } from 'react';
import styles from '../css/index.module.scss';
import MyInput from '../../../../ui-kit/input';
import useInputState from '../../../../helpers/hooks/useInputState';
import MyRadioSelect from '../../../../ui-kit/radio-select';
import { URL_MODE_DATA } from '../../../../helpers/local-data/radio-buttons-data';
import MyCheckbox from '../../../../components/checkbox';

function VncPart({ settings, setSettings }) {
  const setKeepOpen = (val) => {
    setSettings((prev) => ({ ...prev, keepOpen: val }));
  };
  const setAskPassword = (val) => {
    setSettings((prev) => ({ ...prev, askPassword: val }));
  };

  const setBaseUrl = (ev) => {
    setSettings((prev) => ({ ...prev, vncUrl: ev.target.value }));
  };

  const setPassword = (ev) => {
    setSettings((prev) => ({ ...prev, password: ev.target.value }));
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
          rightComponent="Do not close the VNC frame window if the user switches to another tab. Allows you to save state if the user navigates to an internal section in the frame or works with form filling"
        />
      </div>
      <div className={styles.toolSettingsRow}>
        <p className={styles.toolSettingsTitle}>Vnc URL</p>
        <MyInput
          wrapperClassName={styles.toolSettingsMain}
          value={settings.vncUrl || ''}
          onChange={setBaseUrl}
          placeholder="ws://aquris.aiwess.com:12659"
          info="Url must be a ws:// or a wss:// (websocket) URL for the project to function properly"
        />
      </div>
      <div className={styles.toolSettingsRow}>
        <p className={styles.toolSettingsTitle}>Ask password</p>
        <MyCheckbox
          className={styles.toolSettingsMain}
          value={settings.askPassword}
          onChange={setAskPassword}
          returnFinalVal
          rightComponent="Prompt for the password of the server connected to VNC every time you try to open the frame."
        />
      </div>
      {!settings?.askPassword && (
        <div className={styles.toolSettingsRow}>
          <p className={styles.toolSettingsTitle}>Password</p>
          <MyInput
            wrapperClassName={styles.toolSettingsMain}
            value={settings.password || ''}
            onChange={setPassword}
            type="password"
            placeholder="********"
          />
        </div>
      )}

    </div>
  );
}

export default VncPart;

/* {
    keepOpen: boolean,
    vncUrl: string,
    askPassword: boolean,
    password: string,
} */

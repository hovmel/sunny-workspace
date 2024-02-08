import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/index.module.scss';
import MyInput from '../../../ui-kit/input';
import useInputState from '../../../helpers/hooks/useInputState';
import MyCheckbox from '../../../components/checkbox';
import MyOrangeButton from '../../../ui-kit/orange-button';
import sendRequest from '../../../helpers/sendRequest';
import Api from '../../../api';

function CreateProject() {
  const navigate = useNavigate();

  const [title, setTitle, titleError, setTitleError] = useInputState();
  const [agree, setAgree] = useState(false);
  const [agreeError, setAgreeError] = useState('');
  const [loading, setLoading] = useState(false);

  const onCreateClick = async () => {
    let flag = false;
    if (title.length < 3) {
      setTitleError('At least 3 characters');
      flag = true;
    }
    if (!agree) {
      setAgreeError('You need to agree with our policy');
      flag = true;
    }
    if (flag) return;

    const payload = { title };

    const { data } = await sendRequest({
      request: Api.createProject,
      payload,
      warnErrorText: 'while creating project',
      setLoading,
    });

    if (data?.id) {
      navigate(`/projects/edit/${data.id}`);
    }
  };

  return (
    <div className={styles.createProjectView}>
      <p className={styles.createProjectViewText}>New project</p>

      <MyInput
        value={title}
        onChange={setTitle}
        error={titleError}
        label="Title"
        placeholder="Team Ject Project"
      />

      <div className={styles.createProjectViewBottomPart}>
        <MyCheckbox
          value={agree}
          onChange={setAgree}
          error={agreeError}
          setError={setAgreeError}
          rightComponent={(
            <div>Я согласен с условиями</div>
               )}
        />

        <MyOrangeButton
          className={styles.createProjectViewButton}
          text="CREATE"
          onClick={onCreateClick}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default CreateProject;

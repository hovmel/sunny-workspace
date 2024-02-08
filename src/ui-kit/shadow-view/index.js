import React from 'react';
import styles from './css/index.module.scss';
import { COLORS } from '../../helpers/constants';

function ShadowView({
  className, children, shadowType, borderRadius, backgroundColor, ...p
}) {
  const style = generateShadowStyle({ shadowType, borderRadius, backgroundColor });

  return (
    <div
      className={className}
      style={style}
      {...p}
    >
      {children}
    </div>
  );
}

const generateShadowStyle = ({ shadowType, borderRadius, backgroundColor }) => {
  const left = shadowType[0];
  const top = shadowType[1];
  const blur = shadowType[2];
  const tmpBorderRadius = borderRadius || shadowType[3];
  const mode = shadowType[4];

  const boxShadow = `${mode ? `${mode} ` : ''}${left}px ${top}px ${blur}px #ede9e2, ${-left}px ${-top}px ${blur}px #ffffff`;

  return {
    borderRadius: `${tmpBorderRadius}px`,
    background: backgroundColor || COLORS.main,
    boxShadow,
    transition: 'all .3s',
  };
};

export default ShadowView;

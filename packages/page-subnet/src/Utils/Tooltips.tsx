import Icon from '@polkadot/react-components/Icon';
import Tooltip from '@polkadot/react-components/Tooltip';
import React from 'react';
import { useTranslation } from '../translate.js';

interface Props {
  title: string;
  tips: string;
}

function Tooltips({ title, tips }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const triggerId = `${title}-tooltip-trigger`;

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
      <span>{t(title)}</span>
      <Icon
        icon='info-circle'
        tooltip={triggerId}
      />
      <Tooltip trigger={triggerId}>
        <span>{t(tips)}</span>
      </Tooltip>
    </div>
  );
}

export default Tooltips;

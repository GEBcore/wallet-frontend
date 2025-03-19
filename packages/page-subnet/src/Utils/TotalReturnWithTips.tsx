import React from 'react';
import { useTranslation } from '../translate.js';
import Tooltips from './Tooltips.js';

interface Props {
  value: string;
}

function TotalReturnWithTips({ value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  return (
    <Tooltips key={''} title={value} tips={t('The data provided is 24-hour estimated values and may have discrepancies from actual earnings. Your realized profits will be directly added to your staked amount. The stake can be released at any time without a lock-up period.')}/>
  )
}

export default TotalReturnWithTips;

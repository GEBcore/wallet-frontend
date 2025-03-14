 import React from 'react';
import { AddressSmall, Table } from '@polkadot/react-components';
import { useTranslation } from '../translate.js';
import { formatBEVM } from '../Utils/formatBEVM.js';
import { useToggle } from '@polkadot/react-hooks';
 import { NeuronInfoItem } from './SubnetDetail.js';

interface Props {
  className?: string;
  info: NeuronInfoItem
}

function SubnetInfoTr({ className, info }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isExpanded, toggleIsExpanded] = useToggle(false);

  return (
    <React.Fragment>
      <tr className={`${className} isExpanded isFirst ${isExpanded ? 'packedBottom' : 'isLast'}`}>
        <td>{info.netuid}</td>
        <td>{info.userType}</td>
        <td>{info.uid}</td>
        <td>{formatBEVM(info.totalStake)}</td>
        <td>{info.validatorTrust}</td>
        <td>{info.trust}</td>
        <td><AddressSmall value={info.hotkey} /></td>
        <td><AddressSmall value={info.coldkey} /></td>
        <Table.Column.Expand
          isExpanded={isExpanded}
          toggle={toggleIsExpanded}
        />
      </tr>
      {isExpanded && (
        <tr className={`${className} isExpanded details-row`}>
          <td colSpan={9}>
            <div style={{
              display: 'flex',
              gap: '10rem',
              padding: '1rem'
            }}>
              <div>
                <h5>{t('Consensus')}</h5>
                <div>{info.consensus}</div>
              </div>
              <div>
                <h5>{t('Incentive')}</h5>
                <div>{info.incentive}</div>
              </div>
              <div>
                <h5>{t('Dividends')}</h5>
                <div>{info.dividends}</div>
              </div>
              <div>
                <h5>{t('Axon')}</h5>
                <div>{info.axonInfo.ip}</div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

export default React.memo(SubnetInfoTr);

 import React from 'react';
import { AddressSmall, Table, Tooltip } from '@polkadot/react-components';
import { useTranslation } from '../translate.js';
import { formatBEVM } from '../Utils/formatBEVM.js';
import { useToggle } from '@polkadot/react-hooks';
 import { NeuronInfoItem } from './SubnetDetail.js';
 import Tooltips from '../Utils/Tooltips.js';

interface Props {
  className?: string;
  pos: number;
  info: NeuronInfoItem
}

function SubnetInfoTr({ className, pos, info }: Props): React.ReactElement<Props> {
  const [isExpanded, toggleIsExpanded] = useToggle(false);

  return (
    <React.Fragment>
      <tr className={`${className} isExpanded isFirst ${isExpanded ? 'packedBottom' : 'isLast'}`}>
        <td>{pos}</td>
        <td>{info.userType}</td>
        <td>{info.uid}</td>
        <td>{formatBEVM(info.totalStake)}</td>
        <td>{info.vtrustFmt}</td>
        <td>{info.trustFmt}</td>
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
                <Tooltips
                  key="consensus"
                  title={'consensus'}
                  tips={'Executor consensus'}
                />
                <div>{info.consensusFmt}</div>
              </div>
              <div>
                <Tooltips
                  key="incentives"
                  title={'incentives'}
                  tips={'Executor incentive'}
                />
                <div>{info.incentiveFmt}</div>
              </div>
              <div>
                <Tooltips
                  key="dividends"
                  title={'dividends'}
                  tips={'Auditor dividends'}
                />
                <div>{info.dividendsFmt}</div>
              </div>
              <div>
                <Tooltips
                  key="lastUpdated"
                  title={'last updated'}
                  tips={'The GEB block corresponding to the most recent response.'}
                />
                <div>{info.lastUpdate}</div>
              </div>
              <div>
                <Tooltips
                  key="axon"
                  title={'axon'}
                  tips={'The communication endpoint of the participant.'}
                />
                <div>{info.axonInfo.ip + ':' + info.axonInfo.port}</div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

export default React.memo(SubnetInfoTr);

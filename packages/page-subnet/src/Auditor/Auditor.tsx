import React, { useEffect, useState } from 'react';
import { useTranslation } from '../translate.js';
import { AddressSmall, Button, Table } from '@polkadot/react-components';
import { formatBEVM } from '../Utils/formatBEVM.js';
import { Input } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import TotalReturnWithTips from '../Utils/TotalReturnWithTips.js';
import StakingModal from '../User/StakingModal.js';
import { axiosXAgereRpc } from '../axiosXAgereRpc.js';
import Tooltips from '../Utils/Tooltips.tsx';
interface Props {
  className?: string;
}

interface DelegateInfo {
  delegateAddress: string;
  commission:string;
  totalStake:number;
  nominatorsCount:number;
  totalDailyReturn:number;
  actives: number;
}

function Auditor({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { systemChain } = useApi();
  const { allAccounts, hasAccounts } = useAccounts()
  const [subnets, setSubnets] = useState<DelegateInfo[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [selectedAccount, setSelectedAccount] = useState<string>(hasAccounts ? allAccounts[0] : '');
  const [isStakingOpen, toggleIsStakingOpen] = useToggle();
  const [openStakeHotAddress, setOpenStakeHotAddress] = useState<string>('');


  useEffect((): void => {
    if(!systemChain) return
    axiosXAgereRpc('/xagere/getDelegates', {}, systemChain)
    .then(response => {
      const { data } = response
      if (data && Array.isArray(data)) {
        const processedDelegates = data.map(delegate => ({
          ...delegate,
          actives: delegate.actives.filter(active => active === true).length
        }));
        const sortedDelegates = processedDelegates.sort((a, b) =>
          Number(b.totalStake) - Number(a.totalStake)
        );
        setSubnets(sortedDelegates);
      }
    })
    .catch(error => {
      console.error('Error fetching ageres:', error);
    });
  }, [systemChain]);

  const header = [
    [t('Pos'), 'start'],
    [t('Hot Address'), 'start'],
    [t('Commission'), 'start'],
    [t('Total Stake'), 'start'],
    [t('Nominator'), 'start'],
    [<TotalReturnWithTips value={'Earn(24h)'}/>, 'start'],
    [<Tooltips title={'Active'} tips={'Show how many ageres the auditor has the identity of auditor in.'}/>, 'start'],
    [t('Operation'), 'start']
  ];

  function fetchDelegatedData(): void {
        throw new Error('Function not implemented.');
  }

  return (
    <div className={className}>
      <div className='filter'>
        <Input
          autoFocus
          isFull
          onChange={(e) => setFilter(e.target.value)}
          label={t('filter by Hot Address')}
          value={filter}
        />
      </div>



      <Table
        empty={t('No ageres found')}
        header={header}
      >
          {subnets.filter(s =>
            filter === '' ||
            Object.values(s).some(v =>
              String(v).toLowerCase().includes(filter.toLowerCase())
            )
          )?.map((info, index) => (
            <tr key={`${info.delegateAddress}`} className='ui--Table-Body' style={{height:'70px'}}>
              <td className='number' style={{textAlign:'start'}}>{index}</td>
              <td className='address' style={{textAlign:'start'}}><AddressSmall value={info.delegateAddress} /></td>
              <td className='number' style={{textAlign:'start'}}>{info.commission}</td>
              <td className='number' style={{textAlign:'start'}}>{formatBEVM(info.totalStake)}</td>
              <td className='number' style={{textAlign:'start'}}>{info.nominatorsCount}</td>
              <td className='number' style={{textAlign:'start'}}>{formatBEVM(info.totalDailyReturn)}</td>
              <td className='number' style={{textAlign:'start'}}>{info.actives}</td>
              <td>
                <Button
                  icon='paper-plane'
                  isDisabled={!selectedAccount}
                  label={t('Stake')}
                  onClick={()=>{toggleIsStakingOpen();setOpenStakeHotAddress(info.delegateAddress)}}
                />
              </td>
            </tr>
          ))}
      </Table>
      {isStakingOpen && (
        <StakingModal
          account={selectedAccount}
          modelName={'Stake'}
          toggleOpen={toggleIsStakingOpen}
          hotAddress={openStakeHotAddress}
          type={'addStake'}
          name={'Stake'}
          onSuccess={fetchDelegatedData}
        />
      )}
    </div>
  );
}

export default React.memo(Auditor);

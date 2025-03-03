import React, { useEffect, useState } from 'react';
import { useTranslation } from '../translate.js';
import { AddressSmall, Table } from '@polkadot/react-components';
import { callXAgereRpc } from '../callXAgereRpc.js';
import { formatBEVM } from '../Utils/formatBEVM.js';
import { Input } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import Icon from '@polkadot/react-components/Icon';
import Tooltip from '@polkadot/react-components/Tooltip';
import TotalReturnWithTips from '../Utils/TotalReturnWithTips.js';
interface Props {
  className?: string;
}

interface SubnetIdentity {
    subnet_name: number[];
    github_repo: number[];
    subnet_contact: number[];
}

interface DelegateInfo {
    delegate_ss58: string;
    take: number;
    nominators: [string, string][];
    owner_ss58: string;
    registrations: number[];
    identities: (SubnetIdentity | null)[];
    actives: boolean[];
    stakes: string[];
    ranks: number[];
    validator_permits: number[];
    return_per_1000: string;
    total_daily_return: string;
    total_stake: string;
  }
function Validator({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { systemChain } = useApi();
  const [subnets, setSubnets] = useState<DelegateInfo[]>([]);
  const [filter, setFilter] = useState<string>('');

  useEffect((): void => {
    callXAgereRpc('xagere_getDelegates', [], systemChain)
      .then(response => {
        // console.log('Subnets Response:', response);
        if (response && Array.isArray(response)) {
          const sortedDelegates = response.sort((a, b) =>
            Number(b.total_stake) - Number(a.total_stake)
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
    [t('Earn(24h)'), 'start'],
  ];

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
            <tr key={`${info.delegate_ss58}`} className='ui--Table-Body' style={{height:'70px'}}>
              <td className='number' style={{textAlign:'start'}}>{index}</td>
              <td className='address' style={{textAlign:'start'}}><AddressSmall value={info.delegate_ss58} /></td>
              <td className='number' style={{textAlign:'start'}}>{(info.take/65535*100).toFixed(2)}%</td>
              <td className='number' style={{textAlign:'start'}}>{formatBEVM(Number(info.total_stake))}</td>
              <td className='number' style={{textAlign:'start'}}>{info.nominators.length}</td>
              <td className='number' style={{textAlign:'start'}}><TotalReturnWithTips key={`${info.delegate_ss58}-${index}`} value={formatBEVM(Number(info.total_daily_return))}/></td>
            </tr>
          ))}
      </Table>
    </div>
  );
}

export default React.memo(Validator);

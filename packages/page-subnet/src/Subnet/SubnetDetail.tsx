import React, { useEffect, useState } from 'react';
import { useTranslation } from '../translate.js';
import { AddressSmall, Button, CardSummary, Input, SummaryBox, Table } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import SubnetInfoTr from './SubnetInfoTr.js';
import { formatBEVM } from '../Utils/formatBEVM.js';
import { axiosXAgereRpc } from '../axiosXAgereRpc.js';
import Tooltips from '../Utils/Tooltips.tsx';

interface Props {
  className?: string;
  selectedId: string;
  onClose: () => void;
}

export interface NeuronInfoItem {
  userType: string;
  totalStake: number;
  hotkey: string;
  coldkey: string;
  uid: number;
  netuid: number;
  active: boolean;
  axonInfo: {
    ip: string;
    port: number;
    ipType:number;
    protocol: number;
    placeholder1:number;
    placeholder2:number;
  };
  prometheusInfo: {
    ip: string;
    port: number;
  };
  rank:number;
  emission:number;
  incentive: number;
  consensus:number;
  trust: number;
  validatorTrust: number;
  dividends: number;
  lastUpdate: number;
  validatorPermit: boolean
  pruningScore: number;
  vtrustFmt: string;
  trustFmt: string;
  consensusFmt: string;
  incentiveFmt: string;
  dividendsFmt: string;
}
interface NeuronInfo {
  auditorCount: number;
  minerCount: number;
  data:NeuronInfoItem[]
}

interface SubnetInfo {
  netuid: number;
  rho: number;
  kappa: number;
  difficulty: number;
  immunityPeriod: number;
  maxAllowedValidators: number;
  minAllowedWeights: number;
  maxWeightsLimit: number;
  scalingLawPower: number;
  subnetworkN: number;
  maxAllowedUids: number;
  blocksSinceLastStep: number;
  tempo: number;
  networkModality: number;
  emissionValues: number;
  burn: number;
  recycled: number;
  owner: string;
  identity: {
    subnetName: string;
    githubRepo: string;
    subnetContact: string;
  }
}

function SubnetDetail({ className, selectedId, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [subnet, setSubnet] = useState<SubnetInfo | null>(null)
  const [neuronsList, setNeuronsList] = useState<NeuronInfo | null>(null)
  const { systemChain } = useApi();

  const fetchSubnetInfo = (id: string) => {
    axiosXAgereRpc('/xagere/getSubnetDetail', {netuid:id}, systemChain)
      .then(response => {
        console.log('/xagere/getSubnetDetail Response:', response);
        setSubnet(response)
      })
      .catch(error => {
        console.error('/xagere/getSubnetDetail Error:', error);
      });
  }

  const fetchNeuronsList = (id: string) => {
    axiosXAgereRpc('/xagere/getNeurons', {netuid:id}, systemChain)
      .then(response => {
        console.log('/xagere/getNeurons Response:', response);
        setNeuronsList(response);
      })
      .catch(error => {
        console.error('/xagere/getNeurons Error:', error);
      });
  }

  useEffect((): void => {
    if(!systemChain || !selectedId) return
    fetchSubnetInfo(selectedId)
    fetchNeuronsList(selectedId)
  }, [systemChain, selectedId]);

  const header = [
    [t('Pos'), 'start'],
    [t('User Type'), 'start'],
    [t('UID'), 'start'],
    [t('Stake'), 'start'],
    [<Tooltips title={'ATrust'} tips={'The auditor\'s score, the closer it is to 1, indicates that the auditor is more aligned with the consensus.'}/>, 'start'],
    [<Tooltips title={'Trust'} tips={'The auditor\'s score, the closer it is to 1, indicates that the executor is more aligned with the consensus.'}/>, 'start'],
    [t('Hot Key'), 'start'],
    [t('Cold Key'), 'start'],
    []
  ];

  const tableHeader: [React.ReactNode?, string?, number?][] = [
    [subnet?.identity?.subnetName ? t(`${subnet.identity.subnetName} Details`) : t('Subnet Details'), 'start', 1],
    [<Button
      icon='times'
      onClick={onClose}
      label={t('Back to homepage')}
    />, 'end', 1]
  ];

  return (
   <>
     <Table
       className={className}
       header={tableHeader}
     >
       <tr>
         <td colSpan={2}>
           <div style={{display:'flex', flexDirection:'column', gap:'0.25rem'}}>
             <div>Owner</div>
             <AddressSmall value={subnet?.owner} />
           </div>
         </td>
       </tr>
       <tr>
         <td colSpan={2}>
         <Input
             className='full'
             isDisabled
             label={t('Github Repo')}
             value={subnet?.identity?.githubRepo}
           />
         </td>
       </tr>
       <tr>
         <td colSpan={2}>
           <Input
             className='full'
             isDisabled
             label={t('Contact')}
             value={subnet?.identity?.subnetContact}
           />
         </td>
       </tr>
     </Table>
     <SummaryBox className={className}>
       <CardSummary label={t('Emissions')}>
         <span>{formatBEVM(subnet?.emissionValues ?? 0)}</span>
       </CardSummary>
       <CardSummary label={t('Auditor')}>
         <span>{neuronsList?.auditorCount} / {subnet?.maxAllowedValidators}</span>
       </CardSummary>
       <CardSummary label={t('Miner')}>
         <span>{neuronsList?.minerCount} / {Number(subnet?.maxAllowedUids) - Number(subnet?.maxAllowedValidators)}</span>
       </CardSummary>
     </SummaryBox>

     <Table
       empty={t('No neurons found')}
       header={header}
     >
       {neuronsList?.data?.map((info, index) => (
         <SubnetInfoTr
           key={info.hotkey}
           pos={index + 1}
           className={className}
           info={info}
         />
       ))}
     </Table>
   </>
  );
}

export default React.memo(SubnetDetail);

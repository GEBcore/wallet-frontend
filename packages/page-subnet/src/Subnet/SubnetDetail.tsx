import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../translate.js';
import { Button, CardSummary, Input, InputAddress, SummaryBox, Table } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import SubnetInfoTr from './SubnetInfoTr.js';
import { asciiToString, formatBEVM } from '../Utils/formatBEVM.js';
import { axiosXAgereRpc } from '../axiosXAgereRpc.js';

interface Props {
  className?: string;
  selectedId: number;
  onClose: () => void;
}

interface NeuronInfoItem {
  userType: string;
  totalStake: number;
  hotkey: string;
  coldkey: string;
  uid: 1;
  netuid: 1;
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

  const fetchSubnetInfo = (id: number) => {
    axiosXAgereRpc('/xagere/getSubnetDetail', {netuid:id}, systemChain)
      .then(response => {
        console.log('/xagere/getSubnetDetail Response:', response);
        setSubnet(response)
      })
      .catch(error => {
        console.error('/xagere/getSubnetDetail Error:', error);
      });
  }

  const fetchNeuronsList = (id: number) => {
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
    if(!systemChain) return
    fetchSubnetInfo(selectedId)
    fetchNeuronsList(selectedId)
  }, [systemChain, selectedId]);

  const header = [
    [t('Pos'), 'start'],
    [t('User Type'), 'start'],
    [t('User UID'), 'start'],
    [t('Stake'), 'start'],
    [t('VTrust'), 'start'],
    [t('Trust'), 'start'],
    [t('Hot Key'), 'start'],
    [t('Cold Key'), 'start'],
    []
  ];

  const headerRef = useRef<[React.ReactNode?, string?, number?][]>([
    [t(`${subnet?.identity.subnetName} Details`), 'start', 1],
    [<Button
      icon='times'
      onClick={onClose}
      label={t('Back to homepage')}
    />, 'end', 1]

  ]);

  return (
   <>
     <Table
       className={className}
       header={headerRef.current}
     >
       <tr>
         <td colSpan={2}>
           <InputAddress
            label={t('Owner')}
            value={subnet?.owner ?? '-'}
            isDisabled={true}
            type='allPlus'
            defaultValue={subnet?.owner ?? '-'}
          />
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
         <span>{subnet?.maxAllowedValidators}</span>
       </CardSummary>
       <CardSummary label={t('Miner')}>
         <span>{subnet.mi}</span>
       </CardSummary>
     </SummaryBox>

     <Table
       empty={t('No neurons found')}
       header={header}
     >
       {neuronsList?.data?.map((info) => (
         <SubnetInfoTr
           key={info.hotkey}
           className={className}
           info={info}
         />
       ))}
     </Table>
   </>
  );
}

export default React.memo(SubnetDetail);

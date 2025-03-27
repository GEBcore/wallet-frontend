import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../translate.js';
import { AddressSmall, Button, CardSummary, SummaryBox, Table, ToggleGroup } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { formatBEVM } from '../Utils/formatBEVM.js';
import { axiosXAgereRpc } from '../axiosXAgereRpc.js';
import Tooltips from '../Utils/Tooltips.tsx';
import { styled } from 'styled-components';

interface Props {
  className?: string;
  selectedId: string;
  onClose: () => void;
}

interface NominatorInfo {
  address: string;
  amount: number;
}

interface PerformanceInfo {
  agereName: string;
  stakePos: number;
  uid: number;
  aTrust: string;
  dividends: string;
  dominance: string;
  emission: number;
  axonInfo: {
    ip: string;
    port: number;
    ipType: number;
    protocol: number;
    placeholder1: number;
    placeholder2: number;
  }
}

interface AuditorInfo {
  hotkey: string;
  coldkey: string;
  registerTime: number;
  emission: number;
  totalStake: number;
  selfStake: number;
  activeAgere: string;
  commission: string;
  performances: PerformanceInfo[];
  nominators: NominatorInfo[];
}

const KeyStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  margin-left: 2rem;
  border: 1px dashed rgba(34, 36, 38, .15);
  color: rgba(0, 0, 0, .87);
  border-radius: .28571429rem;
  transition: box-shadow .1s ease, border-color .1s ease;
  box-shadow: none;
  background: transparent;
  padding: 7.5px 14.5px 7.5px 20.3px;
  .key-label {
    font-size: 12.46px;
    color: #717171;
    font-weight: 500;
    margin-bottom: 3.5px;
  }
`;

function AuditorDetail({ className, selectedId, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [typeIndex, setTypeIndex] = useState(0);
  const [auditorActive, setAuditorActive] = useState(true);
  const [auditor, setAuditor] = useState<AuditorInfo | null>(null);
  const [performanceActive, setPerformanceActive] = useState(true);
  const [performance, setPerformance] = useState<PerformanceInfo[]>([]);
  const [activeTab, setActiveTab] = useState<'performance' | 'nominators'>('performance');
  const { systemChain } = useApi();

  const stashTypes = useRef([
    { text: t('Performance'), value: 'performance' },
    { text: t('Nominators'), value: 'nominators' },
  ]);
  const fetchAuditorInfo = (address: string) => {
    setAuditorActive(true);
    axiosXAgereRpc('/xagere/getAuditorInfo', {address: address}, systemChain)
      .then(response => {
        setAuditorActive(false);
        console.log('getAuditorInfo', response);
        setAuditor(response);
        setPerformance(response.performances);
      })
      .catch(error => {
        setAuditorActive(false);
        console.error('/xagere/getAuditorInfo Error:', error);
      });
  };

  useEffect((): void => {
    debugger
    if(!systemChain || !selectedId) return;
    fetchAuditorInfo(selectedId);
  }, [systemChain, selectedId]);

  const performanceHeader = [
    [t('Agere Name'), 'start'],
    [t('Stake Pos'), 'start'],
    [t('UID'), 'start'],
    [<Tooltips title={'ATrust'} tips={'The auditor\'s score, the closer it is to 1, indicates that the auditor is more aligned with the consensus.'}/>, 'start'],
    [t('Dividends'), 'start'],
    [t('Emission(24h)'), 'start'],
    [t('Axon'), 'start']
  ];

  const nominatorsHeader = [
    [t('Account'), 'start'],
    [t('Delegate Amount'), 'start'],
    // [t('Reward Amount'), 'start']
  ];

  const mainInfoHeader: [React.ReactNode?, string?, number?][] = [
    [<span style={{textTransform: 'none'}}>{t('Auditor Details')}</span>, 'start', 1],
    [<Button
      icon='times'
      onClick={onClose}
      label={t('Back to homepage')}
    />, 'end', 1]
  ];

  return (
    <>
      <Table
        header={mainInfoHeader}
        empty={!auditorActive && t('No matches found')}
        emptySpinner={t('Loading...')}
      >
        {auditor && <>
          <tr>
            <td colSpan={2}>
              <KeyStyled>
                <div className='key-label'>{t('Hot Key')}</div>
                <AddressSmall value={auditor.hotkey} />
              </KeyStyled>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <KeyStyled>
                <div className='key-label'>{t('Cold Key')}</div>
                <AddressSmall value={auditor.coldkey} />
              </KeyStyled>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <KeyStyled>
                <div className='key-label'>{t('Registered Time')}</div>
                <div>{new Date(auditor.registerTime * 1000).toLocaleString()}</div>
              </KeyStyled>
            </td>
          </tr>
        </>}
      </Table>
      <SummaryBox className={className}>
        <CardSummary label={t('Total Stake')}>
          <span>{formatBEVM(auditor?.totalStake ?? 0)}</span>
        </CardSummary>
        <CardSummary label={t('Self Stake')}>
          <span>{formatBEVM(auditor?.selfStake ?? 0)}</span>
        </CardSummary>
        <CardSummary label={t('Commission')}>
          <span>{auditor?.commission}</span>
        </CardSummary>
        <CardSummary label={t('Active Ageres')}>
          <span>{auditor?.activeAgere}</span>
        </CardSummary>
        <CardSummary label={t('Emission(24h)')}>
          <span>{formatBEVM((auditor?.emission ?? 0) * 24)}</span>
        </CardSummary>
      </SummaryBox>

      <div style={{ marginBottom: '1rem', display:'flex' }}>
        <Button.Group>
          <ToggleGroup
            onChange={setTypeIndex}
            options={stashTypes.current}
            value={typeIndex}
          />
        </Button.Group>
      </div>

      {stashTypes.current[typeIndex].value === 'performance' && <Table
        header={performanceHeader}
        empty={!performanceActive && t('No performance data found')}
        emptySpinner={t('Loading...')}
      >
        {performance?.map((info) => (
          <tr key={info.uid}>
            <td>{info.agereName}</td>
            <td>{info.stakePos}</td>
            <td>{info.uid}</td>
            <td>{info.aTrust}</td>
            <td>{info.dividends}</td>
            <td>{formatBEVM(info.emission * 24)}</td>
            <td>{info.axonInfo.ip}:{info.axonInfo.port}</td>
          </tr>
        ))}
      </Table>}
      {stashTypes.current[typeIndex].value === 'nominators' && <Table
        header={nominatorsHeader}
        empty={t('No nominators found')}
        emptySpinner={t('Loading...')}
      >
        {auditor?.nominators
          ?.slice()
          .sort((a, b) => b.amount - a.amount)
          .map((info) => (
            <tr key={info.address}>
              <td><AddressSmall value={info.address} /></td>
              <td>{formatBEVM(info.amount)}</td>
            </tr>
          ))
        }
      </Table>}
    </>
  );
}

export default React.memo(AuditorDetail);

import React, { useEffect, useState } from 'react';
import { useTranslation } from '../translate.js';
import { AddressSmall, Button, CardSummary, SummaryBox, Table } from '@polkadot/react-components';
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
  account: string;
  delegateAmount: string;
  rewardAmount: string;
}

interface AuditorInfo {
  hotkey: string;
  coldkey: string;
  registeredTime: string;
  totalStake: number;
  selfStake: number;
  commission: number;
  activeAgeres: number;
  totalAgeres: number;
  emission24h: number;
  nominators: NominatorInfo[];
}

interface PerformanceInfo {
  agereId: number;
  agereName: string;
  stakePos: number;
  uid: number;
  validatorTrust: number;
  dividends: number;
  emission: number;
  axonInfo: {
    ip: string;
    port: number;
  }
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
  const [auditorActive, setAuditorActive] = useState(true);
  const [auditor, setAuditor] = useState<AuditorInfo | null>(null);
  const [performanceActive, setPerformanceActive] = useState(true);
  const [performance, setPerformance] = useState<PerformanceInfo[]>([]);
  const [sortBy, setSortBy] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'performance' | 'nominators'>('performance');
  const { systemChain } = useApi();

  const fetchAuditorInfo = (address: string) => {
    debugger
    setAuditorActive(true);
    setPerformanceActive(true)
    axiosXAgereRpc('/xagere/getAuditorInfo', {address: address}, systemChain)
      .then(response => {
        setAuditorActive(false);
        setPerformanceActive(false)
        console.log('getAuditorInfo', response)
        debugger
        const { data } = response
        const { performances, nominators } = data
        setAuditor(nominators);
        setPerformance(performances)
      })
      .catch(error => {
        setAuditorActive(false);
        setPerformanceActive(false)
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
    [t('Reward Amount'), 'start']
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
                <div>{auditor.registeredTime}</div>
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
          <span>{auditor?.commission ?? 0}%</span>
        </CardSummary>
        <CardSummary label={t('Active Ageres')}>
          <span>{auditor?.activeAgeres ?? 0} / {auditor?.totalAgeres ?? 0}</span>
        </CardSummary>
        <CardSummary label={t('Emission(24h)')}>
          <span>{formatBEVM(auditor?.emission24h ?? 0)}</span>
        </CardSummary>
      </SummaryBox>

      <div style={{ marginBottom: '1rem' }}>
        <Button.Group>
          <Button
            isSelected={activeTab === 'performance'}
            label={t('Performance')}
            onClick={() => setActiveTab('performance')}
          />
          <Button
            isSelected={activeTab === 'nominators'}
            label={t('Nominators')}
            onClick={() => setActiveTab('nominators')}
          />
        </Button.Group>
      </div>

      {activeTab === 'performance' && (
        <Table
          header={performanceHeader}
          empty={!performanceActive && t('No performance data found')}
          emptySpinner={t('Loading...')}
        >
          {performance?.sort((a, b) => {
            if (sortBy === 'atrust') {
              return b.validatorTrust - a.validatorTrust;
            } else if (sortBy === 'dividends') {
              return b.dividends - a.dividends;
            }
            return 0;
          }).map((info) => (
            <tr key={info.agereId}>
              <td>{info.agereName}</td>
              <td>{info.stakePos}</td>
              <td>{info.uid}</td>
              <td>{(info.validatorTrust * 100).toFixed(2)}%</td>
              <td>{(info.dividends * 100).toFixed(2)}%</td>
              <td>{formatBEVM(info.emission * 24)}</td>
              <td>{info.axonInfo.ip}:{info.axonInfo.port}</td>
            </tr>
          ))}
        </Table>
      )}

      {activeTab === 'nominators' && (
        <Table
          header={nominatorsHeader}
          empty={t('No nominators found')}
          emptySpinner={t('Loading...')}
        >
          {auditor?.nominators?.map((info) => (
            <tr key={info.account}>
              <td><AddressSmall value={info.account} /></td>
              <td>{info.delegateAmount}</td>
              <td>{info.rewardAmount}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}

export default React.memo(AuditorDetail);

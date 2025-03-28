// Copyright 2017-2024 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { BN } from '@polkadot/util';
import type {NominatedByMap, SortedTargets, ValidatorInfo} from '../types.js';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button, ToggleGroup } from '@polkadot/react-components';
import { useApi, useBlockAuthors, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import ActionsBanner from './ActionsBanner.js';
import CurrentList from './CurrentList.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  favorites: string[];
  hasAccounts: boolean;
  hasQueries: boolean;
  minCommission?: BN;
  nominatedBy?: NominatedByMap;
  // ownStashes?: StakerState[];
  paraValidators?: Record<string, boolean>;
  stakingOverview?: DeriveStakingOverview;
  targets: ValidatorInfo[];
  toggleFavorite: (address: string) => void;
  toggleLedger?: () => void;
  toggleNominatedBy: () => void;
  onVoteSuccess: () => Promise<void>
}

const EMPTY_PARA_VALS: Record<string, boolean> = {};
const EMPTY_BY_AUTHOR: Record<string, string> = {};
const EMPTY_ERA_POINTS: Record<string, string> = {};

function Overview ({ className = '', favorites, hasAccounts, hasQueries, minCommission, nominatedBy, paraValidators, stakingOverview, targets, toggleFavorite, toggleLedger, toggleNominatedBy, onVoteSuccess }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { byAuthor, eraPoints } = useBlockAuthors();
  // const [intentIndex, _setIntentIndex] = useState(0);
  // const [typeIndex, setTypeIndex] = useState(0);
  const recentlyOnline = useCall<DeriveHeartbeats>(api.derive.imOnline?.receivedHeartbeats);

  // const setIntentIndex = useCallback(
  //   (index: number): void => {
  //     index && toggleNominatedBy();
  //     _setIntentIndex(index);
  //   },
  //   [toggleNominatedBy]
  // );

  // const filterOptions = useRef([
  //   // { text: t('Own validators'), value: 'mine' },
  //   { text: t('All validators'), value: 'all' }
  // ]);

  // const intentOptions = useRef([
  //   { text: t('Active'), value: 'active' },
  //   // { text: t('Waiting'), value: 'waiting' }
  // ]);

  // const ownStashIds = useMemo(
  //   () => ownStashes?.map(({ stashId }) => stashId),
  //   [ownStashes]
  // );

  useEffect((): void => {
    toggleLedger && toggleLedger();
  }, [toggleLedger]);

  // const isOwn = typeIndex === 0;

  return (
    <div className={`${className} staking--Overview`}>
      <Summary
        stakingOverview={stakingOverview}
        targets={targets}
        onVoteSuccess={onVoteSuccess}
      />
      {/*{hasAccounts && (ownStashes?.length === 0) && (*/}
      {/*  <ActionsBanner />*/}
      {/*)}*/}
      {/*<Button.Group>*/}
      {/*  <ToggleGroup*/}
      {/*    onChange={setTypeIndex}*/}
      {/*    options={filterOptions.current}*/}
      {/*    value={typeIndex}*/}
      {/*  />*/}
      {/*  <ToggleGroup*/}
      {/*    onChange={setIntentIndex}*/}
      {/*    options={intentOptions.current}*/}
      {/*    value={intentIndex}*/}
      {/*  />*/}
      {/*</Button.Group>*/}
      <CurrentList
        // byAuthor={intentIndex === 0 ? byAuthor : EMPTY_BY_AUTHOR}
        byAuthor={byAuthor}
        // eraPoints={intentIndex === 0 ? eraPoints : EMPTY_ERA_POINTS}
        eraPoints={eraPoints}
        favorites={favorites}
        hasQueries={hasQueries}
        // isIntentions={intentIndex === 1}
        isIntentions={false}
        isOwn={true}
        key={0}
        // minCommission={intentIndex === 0 ? minCommission : undefined}
        minCommission={minCommission}
        // nominatedBy={intentIndex === 1 ? nominatedBy : undefined}
        nominatedBy={nominatedBy}
        // paraValidators={(intentIndex === 0 && paraValidators) || EMPTY_PARA_VALS}
        paraValidators={paraValidators || EMPTY_PARA_VALS}
        // recentlyOnline={intentIndex === 0 ? recentlyOnline : undefined}
        recentlyOnline={recentlyOnline}
        stakingOverview={stakingOverview}
        targets={targets}
        toggleFavorite={toggleFavorite}
        onVoteSuccess={onVoteSuccess}
      />
    </div>
  );
}

export default React.memo(Overview);

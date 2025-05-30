// Copyright 2017-2024 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component from '../../page-subnet/src/index.js';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {},
    group: 'agere',
    icon: 'network-wired',
    name: 'agere',
    text: t('nav.agere', 'Agere', { ns: 'apps-routing' })
  };
}

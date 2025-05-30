// Copyright 2017-2024 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';

import React, { useMemo, useState } from 'react';

import { useTheme } from '@polkadot/react-hooks';

import Icon from './Icon.js';
import { styled } from './styled.js';
import Tooltip from './Tooltip.js';

interface Props {
  className?: string;
  color?: 'blue' | 'counter' | 'gray' | 'green' | 'highlight' | 'normal' | 'orange' | 'purple' | 'red' | 'transparent' | 'white';
  hover?: React.ReactNode;
  hoverAction?: React.ReactNode;
  icon?: IconName;
  info?: React.ReactNode;
  isBlock?: boolean;
  isSmall?: boolean;
  onClick?: () => void;
}

let badgeId = 0;

function Badge ({ className = '', color = 'normal', hover, hoverAction, icon, info, isBlock, isSmall, onClick }: Props): React.ReactElement<Props> | null {
  const badgeTestId = `${icon ? `${icon}-` : ''}badge`;
  const { theme } = useTheme();

  const [trigger] = useState(() => `${badgeTestId}-hover-${Date.now()}-${badgeId++}`);
  const extraProps = hover
    ? { 'data-for': trigger, 'data-tip': true }
    : {};
  const isHighlight = color === 'highlight';

  const hoverContent = useMemo(() => (
    <div className='hoverContent'>
      <div>{hover}</div>
      {hoverAction && (
        <a
          className={`${color}Color`}
          onClick={onClick}
        >{hoverAction}</a>
      )}
    </div>
  ), [color, hover, hoverAction, onClick]);

  return (
    <StyledDiv
      {...extraProps}
      className={`${className} ui--Badge ${hover ? 'isTooltip' : ''} ${isBlock ? 'isBlock' : ''} ${isSmall ? 'isSmall' : ''} ${onClick ? 'isClickable' : ''} ${isHighlight ? 'highlight--bg' : ''} ${color}Color ${icon ? 'withIcon' : ''} ${info ? 'withInfo' : ''} ${hoverAction ? 'withAction' : ''} ${theme}Theme`}
      data-testid={badgeTestId}
      onClick={hoverAction ? undefined : onClick}
    >
      <div className={isHighlight ? 'highlight--color-contrast' : ''}>
        {(icon && <Icon icon={icon} />)}
        {info}
        {hoverAction && (
          <Icon
            className='action-icon'
            icon='chevron-right'
          />
        )}
      </div>
      {hover && (
        <Tooltip
          className='accounts-badge'
          isClickable={!!hoverAction}
          text={hoverContent}
          trigger={trigger}
        />
      )}
    </StyledDiv>
  );
}

// FIXME We really need to get rid of the px sizing here
const StyledDiv = styled.div`
  border-radius: 16px;
  box-sizing: border-box;
  color: #eeedec;
  display: inline-block;
  font-size: var(--font-size-tiny);
  height: 20px;
  line-height: 20px;
  margin-right: 0.43rem;
  min-width: 20px;
  padding: 0 4px;
  overflow: hidden;
  text-align: center;
  vertical-align: middle;
  width: 20px;

  &.isTooltip {
    cursor: help;
  }

  &.isBlock {
    display: block;
  }

  .ui--Icon {
    cursor: inherit;
    margin-top: 4px;
    vertical-align: top;
    width: 1em;
  }

  &.isClickable:not(.withAction) {
    cursor: pointer;
  }

  &.isSmall {
    font-size: 10px;
    height: 16px;
    line-height: 16px;
    min-width: 16px;
    padding: 0;
    width: 16px;

    .ui--Icon {
      margin-top: 3px;
    }
  }

  &.blueColor {
    background: steelblue;
  }

  &.counterColor {
    margin: 0 0.5rem;
    vertical-align: middle;
  }

  &.grayColor {
    background: #eeedec !important;
    color: #aaa9a8;
  }

  &.redColor {
    background: darkred;
  }

  &.greenColor {
    background: green;
  }

  &.orangeColor {
    background: #FFA34A;
  }

  &.purpleColor {
    background: indigo;
  }

  &.transparentColor {
    background: transparent;
    box-shadow: none;
  }

  &.whiteColor {
    background: rgba(255, 255, 255, 0.3);
  }

  &.recovery, &.warning, &.information, &.important {
    background-color: #FFFFFF;

    &.darkTheme {
      background-color: #212227;
    }
  }

  &.recovery {
    background-image: linear-gradient(0deg, rgba(17, 185, 74, 0.08), rgba(17, 185, 74, 0.08));
    color: #11B94A;
  }

  &.warning {
    background-image: linear-gradient(0deg, rgba(232, 111, 0, 0.08), rgba(232, 111, 0, 0.08));
    color: #FF7D01;
  }

  &.information {
    background-image: linear-gradient(0deg, rgba(226, 246, 255, 0.08), rgba(226, 246, 255, 0.08));
    color: #3BBEFF;

    &.lightTheme {
      background-color: rgba(226, 246, 255, 1);
    }
  }

  &.important {
    background: linear-gradient(0deg, rgba(230, 0, 122, 0.08), rgba(230, 0, 122, 0.08)), rgba(230, 0, 122, 0.01);
    color: #E6007A;
  }

  &.withAction.withIcon:not(.withInfo) {
    width: 34px;
    border-radius: 4px;
  }

  &.withInfo.withIcon:not(.withAction) {
    width: 34px;
    border-radius: 18px;
  }

  &.withAction.withIcon.withInfo {
    width: 44px;
    border-radius: 4px;
  }

  &.withInfo .ui--Icon:not(.action-icon) {
    margin-right: 4px;
  }

  .hoverContent {
    display: flex;
    flex-direction: column;
  }

  .action-icon {
    margin-left: 4px;
  }
`;

export default React.memo(Badge);

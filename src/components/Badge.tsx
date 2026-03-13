import React from 'react';
import {theme} from '../theme';
import {Block} from './Block';
import {Typography} from './Typography';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'primary' | 'secondary';
}

export const Badge = ({label, variant = 'primary'}: BadgeProps) => {
  const config = {
    success: {bg: theme.colors.success[100], text: theme.colors.success[700]},
    warning: {bg: theme.colors.warning[100], text: theme.colors.warning[500]},
    error: {bg: theme.colors.error[100], text: theme.colors.error[700]},
    primary: {bg: theme.colors.primary[100], text: theme.colors.primary[600]},
    secondary: {
      bg: theme.colors.secondary[100],
      text: theme.colors.secondary[900],
    },
  };

  const current = config[variant];

  return (
    <Block
      color={current.bg}
      pv={0.5}
      ph={1.25}
      radius={0.5}
      center
      middle
      style={{alignSelf: 'flex-start'}}>
      <Typography
        variant="caption"
        color={current.text}
        style={{
          fontFamily: theme.typography.fonts.semiBold,
          textTransform: 'uppercase',
        }}>
        {label}
      </Typography>
    </Block>
  );
};

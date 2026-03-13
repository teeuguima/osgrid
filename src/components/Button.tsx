import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {theme} from '../theme';
import {Block} from './Block';
import {Typography} from './Typography';

type SpacingValue = keyof typeof theme.spacing | number;

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'contained' | 'outlined' | 'text';
  color?: keyof typeof theme.colors | string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  flex?: number;
  mt?: SpacingValue;
  mb?: SpacingValue;
  ml?: SpacingValue;
  mr?: SpacingValue;
}

const resolveSpacing = (value: SpacingValue | undefined) => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value * 8;
  return theme.spacing[value as keyof typeof theme.spacing];
};

export const Button = ({
  label,
  variant = 'contained',
  color = 'primary',
  loading,
  icon,
  iconPosition = 'left',
  style,
  flex,
  disabled,
  mt,
  mb,
  ml,
  mr,
  ...props
}: ButtonProps) => {
  // Resolução de cores
  const baseColor =
    (theme.colors as any)[color]?.[600] ||
    (theme.colors as any)[color] ||
    theme.colors.primary[600];
  const errorColor = theme.colors.error[500];
  const finalColor = color === 'error' ? errorColor : baseColor;

  const variantStyles: Record<string, ViewStyle> = {
    contained: {
      backgroundColor: finalColor,
      borderWidth: 0,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: finalColor,
    },
    text: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  };

  const contentColor = variant === 'contained' ? 'white' : finalColor;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        styles.base,
        variantStyles[variant],
        {
          flex: flex,
          marginTop: resolveSpacing(mt),
          marginBottom: resolveSpacing(mb),
          marginLeft: resolveSpacing(ml),
          marginRight: resolveSpacing(mr),
        },
        disabled && styles.disabled,
        style,
      ]}
      {...props}>
      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        <Block row center middle>
          {icon && iconPosition === 'left' && <Block mr={1}>{icon}</Block>}

          <Typography
            variant="bodyBold"
            style={{color: contentColor, textAlign: 'center'}}>
            {label}
          </Typography>

          {icon && iconPosition === 'right' && <Block ml={1}>{icon}</Block>}
        </Block>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: theme.colors.secondary[200],
    borderColor: theme.colors.secondary[300],
  },
});

import React from 'react';
import {Text, TextStyle, TextProps} from 'react-native';
import {typography} from '../theme/typography';
import {colors} from '../theme/colors';

interface TypographyProps extends TextProps {
  variant?: keyof typeof typography.sizes;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export const Typography = ({
  variant = 'body',
  color = colors.text.main,
  align = 'left',
  style,
  ...props
}: TypographyProps) => {
  const variantStyle = typography.sizes[variant] as TextStyle;

  return (
    <Text style={[{color, textAlign: align}, variantStyle, style]} {...props} />
  );
};

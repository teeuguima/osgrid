import React from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
import {theme} from '../theme';
import {Block} from './Block';

// Tipagem alinhada com a nova arquitetura (Token do tema ou Número para 8*valor)
type SpacingValue = keyof typeof theme.spacing | number;

interface CardProps {
  children: React.ReactNode;
  p?: SpacingValue;
  m?: SpacingValue;
  mt?: SpacingValue;
  mb?: SpacingValue;
  radius?: keyof typeof theme.borderRadius | number;
  onPress?: () => void;
  row?: boolean;
  style?: ViewStyle;
}

export const Card = ({
  children,
  p = 2,
  m,
  mt,
  mb,
  radius = 1,
  onPress,
  row,
  style,
}: CardProps) => {
  const Container = onPress ? TouchableOpacity : React.Fragment;
  const containerProps = onPress ? {onPress, activeOpacity: 0.8} : {};

  return (
    <Container {...containerProps}>
      <Block
        card
        row={row}
        p={p}
        m={m}
        mt={mt}
        mb={mb}
        radius={radius}
        style={style}>
        {children}
      </Block>
    </Container>
  );
};

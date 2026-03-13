import React from 'react';
import {View, ViewProps, StyleSheet, ViewStyle} from 'react-native';
import {theme} from '../theme';

type SpacingValue = keyof typeof theme.spacing | number;

interface BlockProps extends ViewProps {
  flex?: number | boolean;
  row?: boolean;
  column?: boolean;
  center?: boolean;
  middle?: boolean;
  top?: boolean;
  bottom?: boolean;
  right?: boolean;
  left?: boolean;
  between?: boolean;
  around?: boolean;
  gap?: number;
  shadow?: keyof typeof theme.shadows;
  card?: boolean;
  color?: string;
  space?: 'between' | 'around' | 'evenly';

  m?: SpacingValue;
  mt?: SpacingValue;
  mb?: SpacingValue;
  ml?: SpacingValue;
  mr?: SpacingValue;
  mv?: SpacingValue;
  mh?: SpacingValue;
  p?: SpacingValue;
  pt?: SpacingValue;
  pb?: SpacingValue;
  pl?: SpacingValue;
  pr?: SpacingValue;
  pv?: SpacingValue;
  ph?: SpacingValue;

  width?: number | string;
  height?: number | string;
  radius?: keyof typeof theme.borderRadius | number;
  children?: React.ReactNode;
}

const resolveSpacing = (value: SpacingValue | undefined) => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value * 8;
  return theme.spacing[value as keyof typeof theme.spacing];
};

const resolveRadius = (
  value: keyof typeof theme.borderRadius | number | undefined,
) => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value * 8;
  return theme.borderRadius[value as keyof typeof theme.borderRadius];
};

export const Block = ({
  flex,
  row,
  column,
  center,
  middle,
  top,
  bottom,
  right,
  left,
  between,
  around,
  gap,
  shadow,
  card,
  color,
  space,
  m,
  mt,
  mb,
  ml,
  mr,
  mv,
  mh,
  p,
  pt,
  pb,
  pl,
  pr,
  pv,
  ph,
  width,
  height,
  radius,
  style,
  children,
  ...props
}: BlockProps) => {
  const blockStyles = [
    styles.block,
    flex === true && {flex: 1},
    typeof flex === 'number' && {flex},
    row && styles.row,
    column && styles.column,
    center && styles.center,
    middle && styles.middle,
    top && {justifyContent: 'flex-start'},
    bottom && {justifyContent: 'flex-end'},
    right && {alignItems: 'flex-end'},
    left && {alignItems: 'flex-start'},
    between && {justifyContent: 'space-between'},
    around && {justifyContent: 'space-around'},
    space && {justifyContent: `space-${space}` as any},
    gap !== undefined && {gap: gap * 8},

    shadow && theme.shadows[shadow],
    card && {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.base,
      padding: theme.spacing.cardPadding,
      ...theme.shadows.light,
    },
    color && {backgroundColor: color},

    m !== undefined && {margin: resolveSpacing(m)},
    mt !== undefined && {marginTop: resolveSpacing(mt)},
    mb !== undefined && {marginBottom: resolveSpacing(mb)},
    ml !== undefined && {marginLeft: resolveSpacing(ml)},
    mr !== undefined && {marginRight: resolveSpacing(mr)},
    mv !== undefined && {marginVertical: resolveSpacing(mv)},
    mh !== undefined && {marginHorizontal: resolveSpacing(mh)},

    p !== undefined && {padding: resolveSpacing(p)},
    pt !== undefined && {paddingTop: resolveSpacing(pt)},
    pb !== undefined && {paddingBottom: resolveSpacing(pb)},
    pl !== undefined && {paddingLeft: resolveSpacing(pl)},
    pr !== undefined && {paddingRight: resolveSpacing(pr)},
    pv !== undefined && {paddingVertical: resolveSpacing(pv)},
    ph !== undefined && {paddingHorizontal: resolveSpacing(ph)},

    width !== undefined && {width},
    height !== undefined && {height},
    radius !== undefined && {
      borderRadius: resolveRadius(radius),
    },
    style,
  ] as ViewStyle[];

  return (
    <View style={blockStyles} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  block: {flexDirection: 'column'},
  row: {flexDirection: 'row'},
  column: {flexDirection: 'column'},
  center: {alignItems: 'center'},
  middle: {justifyContent: 'center'},
});

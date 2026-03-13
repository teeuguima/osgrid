import {colors} from './colors';
import {typography} from './typography';
import {spacing} from './spacing';

export const theme = {
  colors,
  typography,
  spacing,

  borderRadius: {
    none: 0,
    base: 8,
    full: 999,
  },

  shadows: {
    light: {
      shadowColor: colors.secondary[900],
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    medium: {
      shadowColor: colors.secondary[900],
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    dark: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;

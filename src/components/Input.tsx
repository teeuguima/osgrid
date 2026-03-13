import React from 'react';
import {TextInput, TextInputProps, StyleSheet} from 'react-native';
import {theme} from '../theme';
import {Block} from './Block';
import {Typography} from './Typography';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const Input = ({label, error, style, ...props}: InputProps) => {
  return (
    <Block mb={2} gap={0.5}>
      <Typography variant="bodySmallBold" color={theme.colors.text.secondary}>
        {label}
      </Typography>

      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : styles.inputDefault,
          style,
        ]}
        placeholderTextColor={theme.colors.text.light}
        {...props}
      />

      {error && (
        <Typography variant="caption" color={theme.colors.error[500]}>
          {error}
        </Typography>
      )}
    </Block>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.base,
    padding: 16,
    fontSize: 16,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text.main,
    borderWidth: 1,
  },
  inputDefault: {
    borderColor: theme.colors.secondary[200],
  },
  inputError: {
    borderColor: theme.colors.error[500],
  },
});

import React from 'react';
import {
  Modal as RNModal,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {theme} from '../theme';
import {Block} from './Block';
import {Typography} from './Typography';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const Modal = ({
  visible,
  onClose,
  title,
  description,
  children,
}: CustomModalProps) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Block flex bottom style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{width: '100%'}}>
            <TouchableWithoutFeedback>
              <Block
                width="100%"
                color={theme.colors.surface}
                style={styles.sheet}
                p="lg"
                shadow="medium">
                <Block
                  width={40}
                  height={5}
                  color={theme.colors.secondary[200]}
                  center
                  style={styles.handle}
                />

                <Typography variant="h2" style={{marginBottom: 8}}>
                  {title}
                </Typography>

                {description && (
                  <Typography
                    variant="body"
                    color={theme.colors.text.secondary}
                    style={{marginBottom: 16}}>
                    {description}
                  </Typography>
                )}

                <Block mt={1}>{children}</Block>
              </Block>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Block>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  handle: {
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: -5,
  },
});

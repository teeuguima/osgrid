import React from 'react';
import {Modal} from './Modal';
import {Block} from './Block';
import {Button} from './Button';

interface DeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export const DeleteConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  itemName,
}: DeleteModalProps) => {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Excluir Ordem"
      description={`Tem certeza que deseja excluir "${itemName}"? Esta ação removerá o registro permanentemente.`}>
      <Block mt={2}>
        <Button label="Sim, Excluir" color="error" onPress={onConfirm} />

        <Button
          label="Cancelar"
          variant="text"
          color="secondary"
          onPress={onClose}
        />
      </Block>
    </Modal>
  );
};

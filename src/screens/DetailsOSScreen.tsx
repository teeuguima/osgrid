import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import {
  Edit3,
  Trash2,
  Calendar,
  User,
  AlignLeft,
  Hash,
  Clock,
} from 'lucide-react-native';
import {useObject, useRealm} from '../models';
import {OrderService} from '../models/OrderService';
import api from '../services/api';
import {theme} from '../theme';

import {Block} from '../components/Block';
import {Typography} from '../components/Typography';
import {Badge} from '../components/Badge';
import {Card} from '../components/Card';
import {DeleteConfirmationModal} from '../components/DeleteConfirmationModal';
import {UpdateMode} from 'realm';
import {Button} from '../components/Button';

export const DetailsOSScreen = ({route, navigation}: any) => {
  const {osId} = route.params;
  const realm = useRealm();
  const os = useObject(OrderService, osId);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    const fetchFreshData = async () => {
      try {
        const {data} = await api.get(`/work-orders/${osId}`);
        realm.write(() => {
          realm.create(
            OrderService,
            {
              ...data,
              _id: data.id,
              isSynced: true,
            },
            UpdateMode.Modified,
          );
        });
      } catch (error) {
        console.log('Offline: Mantendo dados locais.');
      }
    };
    fetchFreshData();
  }, [osId, realm]);

  const confirmDelete = async () => {
    try {
      realm.write(() => {
        if (os) realm.delete(os);
      });
      setIsDeleteModalVisible(false);
      navigation.goBack();
      await api.delete(`/work-orders/${osId}`);
    } catch (error) {
      console.log('Erro ao deletar na API, removido apenas localmente.');
    }
  };

  return (
    <Block flex color={theme.colors.background}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, padding: theme.spacing.layout}}
        showsVerticalScrollIndicator={false}>
        <Block flex between>
          <Block>
            {/* Header: ID e Sync Status */}
            <Block row between center mb={3}>
              <Block row center>
                <Hash size={14} color={theme.colors.text.light} />
                <Typography
                  variant="caption"
                  color={theme.colors.text.light}
                  style={{marginLeft: 4}}>
                  ID: {os._id.slice(-6).toUpperCase()}
                </Typography>
              </Block>
              {!os.isSynced && (
                <Badge label="Pendente Sync" variant="warning" />
              )}
            </Block>

            <Card p={3} mb={3}>
              <Block gap={3}>
                <Block gap={1}>
                  <Badge
                    label={
                      os.status === 'Completed' ? 'Concluído' : 'Em Aberto'
                    }
                    variant={os.status === 'Completed' ? 'success' : 'primary'}
                  />
                  <Typography variant="h2">{os.title}</Typography>
                </Block>

                <Block gap={0.5}>
                  <Block row center>
                    <User size={20} color={theme.colors.primary[600]} />
                    <Typography
                      variant="bodySmall"
                      color={theme.colors.text.secondary}
                      style={{marginLeft: 4}}>
                      Técnico Responsável
                    </Typography>
                  </Block>
                  <Typography variant="bodyBold">{os.assignedTo}</Typography>
                </Block>

                <Block gap={0.5}>
                  <Block row center>
                    <AlignLeft size={20} color={theme.colors.primary[600]} />
                    <Typography
                      variant="bodySmall"
                      color={theme.colors.text.secondary}
                      style={{marginLeft: 4}}>
                      Descrição
                    </Typography>
                  </Block>
                  <Typography
                    variant="body"
                    color={theme.colors.text.main}
                    style={{lineHeight: 24}}>
                    {os.description || 'Nenhuma descrição fornecida.'}
                  </Typography>
                </Block>

                <Block between gap={2}>
                  <Block gap={0.5}>
                    <Block row center>
                      <Calendar size={18} color={theme.colors.text.light} />
                      <Typography
                        variant="bodySmall"
                        color={theme.colors.text.secondary}
                        style={{marginLeft: 4}}>
                        Criado em
                      </Typography>
                    </Block>
                    <Typography variant="bodySmallBold">
                      {os.createdAt.toLocaleDateString()}
                    </Typography>
                  </Block>

                  {os.updatedAt && (
                    <Block gap={0.5}>
                      <Block row center>
                        <Clock size={18} color={theme.colors.text.light} />
                        <Typography
                          variant="bodySmall"
                          color={theme.colors.text.secondary}
                          style={{marginLeft: 4}}>
                          Atualizado em
                        </Typography>
                      </Block>
                      <Typography variant="bodySmallBold">
                        {os.updatedAt.toLocaleDateString()}
                      </Typography>
                    </Block>
                  )}
                </Block>
              </Block>
            </Card>
          </Block>

          <Block gap={1.5} pb={4}>
            <Button
              label="Editar Ordem"
              onPress={() => navigation.navigate('Form', {osId: os._id})}
            />

            <Button
              label="Excluir Registro"
              variant="text"
              color="error"
              onPress={() => setIsDeleteModalVisible(true)}
            />
          </Block>
        </Block>
      </ScrollView>

      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        itemName={os.title}
      />
    </Block>
  );
};

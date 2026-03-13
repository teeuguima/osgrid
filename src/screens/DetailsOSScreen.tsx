import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useObject, useRealm} from '../models';
import {OrderService} from '../models/OrderService';
import api from '../services/api';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';
import {UpdateMode} from 'realm';

type Props = StackScreenProps<RootStackParamList, 'Details'>;

export const DetailsOSScreen = ({route, navigation}: Props) => {
  const {osId} = route.params;
  const realm = useRealm();
  const os = useObject(OrderService, osId);
  const [loading, setLoading] = useState(false);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      Pending: 'Aberto',
      'In Progress': 'Em Andamento',
      Completed: 'Concluído',
    };
    return labels[status] || status;
  };

  useEffect(() => {
    const fetchFreshData = async () => {
      try {
        setLoading(true);
        const {data} = await api.get(`/work-orders/${osId}`);

        realm.write(() => {
          realm.create(
            OrderService,
            {
              ...data,
              _id: data.id,
              isSynced: true,
              updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
              createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
            },
            UpdateMode.Modified,
          );
        });
      } catch (error) {
        console.log('Offline ou erro ao buscar detalhes reais.');
      } finally {
        setLoading(false);
      }
    };

    fetchFreshData();
  }, [osId, realm]);

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir esta ordem de serviço?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              realm.write(() => {
                if (os) os.deleted = true;
              });
              navigation.goBack();

              await api.delete(`/work-orders/${osId}`);
            } catch (error) {
              console.log(
                'Erro ao deletar na API, ficará marcado como deletado localmente.',
              );
            }
          },
        },
      ],
    );
  };

  if (!os)
    return (
      <View style={styles.center}>
        <Text>Ordem não encontrada.</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.label}>
            ORDEM # {os._id.slice(-6).toUpperCase()}
          </Text>
          {loading && <ActivityIndicator size="small" color="#2563eb" />}
        </View>

        <Text style={styles.title}>{os.title}</Text>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.badge,
              os.completed ? styles.badgeSuccess : styles.badgeWarning,
            ]}>
            <Text style={styles.badgeText}>{getStatusLabel(os.status)}</Text>
          </View>
          {!os.isSynced && <Text style={styles.syncTag}>⏳ Offline</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍🔧 Técnico Responsável</Text>
          <Text style={styles.info}>{os.assignedTo}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Descrição</Text>
          <Text style={styles.info}>{os.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Criado em</Text>
          <Text style={styles.info}>
            {os.createdAt.toLocaleDateString('pt-BR')} às{' '}
            {os.createdAt.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('Form', {osId: os._id})}>
          <Text style={styles.buttonText}>Editar Ordem</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}>
          <Text style={[styles.buttonText, {color: '#ef4444'}]}>
            Excluir Registro
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f1f5f9'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {fontSize: 12, color: '#64748b', fontWeight: 'bold', letterSpacing: 1},
  title: {fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 12},
  statusRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 20},
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  badgeSuccess: {backgroundColor: '#dcfce7'},
  badgeWarning: {backgroundColor: '#fef3c7'},
  badgeText: {fontSize: 12, fontWeight: '600', color: '#166534'},
  syncTag: {fontSize: 11, color: '#f59e0b', fontWeight: 'bold'},
  section: {marginBottom: 20},
  sectionTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '500',
  },
  info: {fontSize: 16, color: '#334155', lineHeight: 22},
  actions: {paddingHorizontal: 16, gap: 12, marginBottom: 40},
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  editButton: {backgroundColor: '#2563eb', borderColor: '#2563eb'},
  deleteButton: {marginTop: 8, borderColor: '#fee2e2'},
  buttonText: {fontWeight: 'bold', fontSize: 16, color: '#fff'},
});

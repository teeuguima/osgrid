import React, {useEffect} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {Picker} from '@react-native-picker/picker';
import {useRoute, useNavigation} from '@react-navigation/native';
import {UpdateMode} from 'realm';

import {useRealm, useObject} from '../models';
import {OrderService} from '../models/OrderService';
import api from '../services/api';
import {OSFormData} from '../types/os';
import {OSEnumStatus} from '../constants/enums';

export const RegisterOSScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const realm = useRealm();

  const osId = route.params?.osId;
  const isEditing = !!osId;
  const os = useObject(OrderService, osId ? String(osId) : '');

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<OSFormData>({
    defaultValues: {
      status: OSEnumStatus.PENDING,
      completed: false,
    },
  });

  useEffect(() => {
    if (os) {
      reset({
        title: os.title,
        description: os.description,
        assignedTo: os.assignedTo,
        status: os.status as OSEnumStatus,
        completed: os.completed,
      });
    }
  }, [os, reset]);

  const onSubmit = async (formData: OSFormData) => {
    const currentId = isEditing ? osId : new Date().getTime().toString();
    const now = new Date();

    try {
      realm.write(() => {
        realm.create(
          OrderService,
          {
            _id: String(currentId),
            title: formData.title,
            description: formData.description,
            assignedTo: formData.assignedTo,
            status: formData.status,
            completed: formData.completed,
            isSynced: false,
            updatedAt: isEditing ? now : undefined,
            createdAt: isEditing ? os?.createdAt ?? now : now,
          },
          UpdateMode.Modified,
        );
      });

      let response;
      if (isEditing) {
        response = await api.put(`/work-orders/${currentId}`, formData);
      } else {
        response = await api.post('/work-orders', formData);
      }

      if (response.status === 200 || response.status === 201) {
        const remoteData = response.data;

        realm.write(() => {
          if (!isEditing) {
            const tempOS = realm.objectForPrimaryKey(OrderService, currentId);
            if (tempOS) realm.delete(tempOS);
          }

          realm.create(
            OrderService,
            {
              ...remoteData,
              _id: remoteData.id,
              isSynced: true,
              updatedAt: remoteData.updatedAt
                ? new Date(remoteData.updatedAt)
                : null,
              createdAt: remoteData.createdAt
                ? new Date(remoteData.createdAt)
                : new Date(),
            },
            UpdateMode.Modified,
          );
        });
      }
    } catch (apiError) {
      console.log(
        'Modo Offline: O dado permanece no Realm para sync posterior.',
      );
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Título da Ordem</Text>
      <Controller
        control={control}
        rules={{required: 'O título é obrigatório'}}
        name="title"
        render={({field: {onChange, value}}) => (
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Ex: Troca de Roteador"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.title && (
        <Text style={styles.errorText}>{errors.title.message}</Text>
      )}

      <Text style={styles.label}>Técnico Responsável</Text>
      <Controller
        control={control}
        rules={{required: 'Informe o técnico'}}
        name="assignedTo"
        render={({field: {onChange, value}}) => (
          <TextInput
            style={[styles.input, errors.assignedTo && styles.inputError]}
            placeholder="Nome do técnico"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.pickerContainer}>
        <Controller
          control={control}
          name="status"
          render={({field: {onChange, value}}) => (
            <Picker selectedValue={value} onValueChange={onChange}>
              <Picker.Item label="Aberto" value={OSEnumStatus.PENDING} />
              <Picker.Item
                label="Em Andamento"
                value={OSEnumStatus.IN_PROGRESS}
              />
              <Picker.Item label="Concluído" value={OSEnumStatus.COMPLETED} />
            </Picker>
          )}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Concluído?</Text>
        <Controller
          control={control}
          name="completed"
          render={({field: {onChange, value}}) => (
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{value ? 'Sim' : 'Não'}</Text>
              <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{false: '#cbd5e1', true: '#93c5fd'}}
                thumbColor={value ? '#2563eb' : '#f4f3f4'}
              />
            </View>
          )}
        />
      </View>

      <Text style={styles.label}>Descrição</Text>
      <Controller
        control={control}
        name="description"
        render={({field: {onChange, value}}) => (
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detalhes do serviço..."
            multiline
            numberOfLines={4}
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>
          {isEditing ? 'Atualizar Ordem' : 'Salvar Ordem'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8fafc'},
  content: {padding: 20},
  label: {fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8},
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 4,
    color: '#1e293b',
  },
  inputError: {borderColor: '#ef4444'},
  errorText: {color: '#ef4444', fontSize: 12, marginBottom: 12},
  textArea: {height: 100, textAlignVertical: 'top'},
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  toggleRow: {flexDirection: 'row', alignItems: 'center'},
  toggleLabel: {marginRight: 8, color: '#64748b', fontWeight: 'bold'},
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});

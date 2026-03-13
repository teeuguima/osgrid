import React, {useEffect} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {Picker} from '@react-native-picker/picker';
import {useRoute, useNavigation} from '@react-navigation/native';
import {UpdateMode} from 'realm';

import {useRealm, useObject} from '../models';
import {OrderService} from '../models/OrderService';
import {OSEnumStatus} from '../constants/enums';
import {Block} from '../components/Block';
import {Typography} from '../components/Typography';
import {theme} from '../theme';
import {Input} from '../components/Input';
import Toast from 'react-native-toast-message';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {Button} from '../components/Button';

const schema = yup.object({
  title: yup
    .string()
    .required('O título é essencial para identificar o serviço')
    .min(5, 'Título muito curto (mínimo 5 caracteres)'),
  assignedTo: yup.string().required('Informe quem executará o serviço'),
  description: yup.string().optional(),
  status: yup.string().required(),
});

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
    formState: {errors, isSubmitting},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      assignedTo: '',
      status: OSEnumStatus.PENDING,
    },
  });

  useEffect(() => {
    if (os) {
      reset({
        title: os.title,
        description: os.description,
        assignedTo: os.assignedTo,
        status: os.status as OSEnumStatus,
      });
    }
  }, [os, reset]);

  const onSubmit = async (formData: any) => {
    const currentId = isEditing ? osId : new Date().getTime().toString();
    const isActuallyCompleted = formData.status === OSEnumStatus.COMPLETED;
    try {
      realm.write(() => {
        realm.create(
          OrderService,
          {
            _id: String(currentId),
            ...formData,
            completed: isActuallyCompleted,
            isSynced: false,
            updatedAt: new Date(),
            createdAt: isEditing ? os?.createdAt : new Date(),
          },
          UpdateMode.Modified,
        );
      });

      Toast.show({
        type: 'success',
        text1: isEditing ? 'OS Atualizada!' : 'OS Criada!',
        text2: 'Os dados foram salvos localmente.',
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar',
        text2: 'Tente novamente em instantes.',
      });
    }
  };

  return (
    <Block flex color={theme.colors.background}>
      <ScrollView
        contentContainerStyle={{padding: theme.spacing.layout}}
        showsVerticalScrollIndicator={false}>
        <Block gap={1}>
          <Controller
            control={control}
            name="title"
            render={({field: {onChange, value}}) => (
              <Input
                label="Título da Ordem"
                placeholder="Ex: Troca de Roteador"
                value={value}
                onChangeText={onChange}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="assignedTo"
            render={({field: {onChange, value}}) => (
              <Input
                label="Técnico Responsável"
                placeholder="Nome do técnico"
                value={value}
                onChangeText={onChange}
                error={errors.assignedTo?.message}
              />
            )}
          />

          <Block gap={0.5}>
            <Typography
              variant="bodySmallBold"
              color={theme.colors.text.secondary}>
              Status do Serviço
            </Typography>
            <Block
              color={theme.colors.surface}
              radius="base"
              style={styles.pickerWrapper}>
              <Controller
                control={control}
                name="status"
                render={({field: {onChange, value}}) => (
                  <Picker
                    selectedValue={String(value)}
                    onValueChange={onChange}
                    dropdownIconColor={theme.colors.primary[600]}
                    style={{color: theme.colors.text.main}}>
                    <Picker.Item label="Aberto" value={OSEnumStatus.PENDING} />
                    <Picker.Item
                      label="Em Andamento"
                      value={OSEnumStatus.IN_PROGRESS}
                    />
                    <Picker.Item
                      label="Concluído"
                      value={OSEnumStatus.COMPLETED}
                    />
                  </Picker>
                )}
              />
            </Block>
          </Block>

          <Controller
            control={control}
            name="description"
            render={({field: {onChange, value}}) => (
              <Input
                label="Descrição (opcional)"
                placeholder="Descreva o problema e a solução..."
                multiline
                numberOfLines={4}
                value={value}
                onChangeText={onChange}
                style={{height: 120, textAlignVertical: 'top'}}
              />
            )}
          />

          <Button
            label={isEditing ? 'Salvar Alterações' : 'Confirmar'}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            mt={2}
          />
        </Block>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  pickerWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.secondary[200],
    overflow: 'hidden',
  },
});

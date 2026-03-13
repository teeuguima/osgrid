import React, {useEffect} from 'react';
import {FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {Plus, Wifi, WifiOff} from 'lucide-react-native';

import {useQuery, useRealm} from '../models';
import {OrderService} from '../models/OrderService';
import {useOSStore} from '../store/useOSStore';
import {theme} from '../theme';

import {Block} from '../components/Block';
import {Typography} from '../components/Typography';
import {OSCard} from '../components/OSCard';
import {HomeSkeleton} from '../components/HomeSkeleton';
import {OSEnumStatus, statusLabels} from '../constants/enums';

const STATUS_MAP = {
  Pending: {
    variant: 'primary' as const,
  },
  'In Progress': {
    variant: 'warning' as const,
  },
  Completed: {
    variant: 'success' as const,
  },
};

export const HomeScreen = ({navigation}: any) => {
  const realm = useRealm();
  const orders = useQuery(OrderService);
  const {isOnline, fetchOrders, isLoading} = useOSStore();

  useEffect(() => {
    fetchOrders(realm);
  }, [isOnline, realm, fetchOrders]);

  const renderItem = ({item}: {item: OrderService}) => {
    const statusConfig = STATUS_MAP[item.status as keyof typeof STATUS_MAP];

    return (
      <OSCard
        title={item.title}
        technician={item.assignedTo}
        date={new Date(item.createdAt).toLocaleDateString()}
        status={statusLabels[item.status as OSEnumStatus]}
        statusVariant={statusConfig.variant}
        onPress={() => navigation.navigate('Details', {osId: item._id})}
      />
    );
  };

  return (
    <Block flex color={theme.colors.background}>
      <Block
        row
        center
        middle
        pv={0.5}
        color={
          isOnline ? theme.colors.success[500] : theme.colors.secondary[500]
        }>
        {isOnline ? (
          <Wifi size={12} stroke="white" />
        ) : (
          <WifiOff size={12} stroke="white" />
        )}
        <Typography
          variant="caption"
          color="white"
          style={{fontWeight: 'bold', marginLeft: 4}}>
          {isOnline ? 'CONECTADO' : 'OFFLINE'}
        </Typography>
      </Block>

      <Block ph="layout" mt={3} mb={1}>
        <Typography variant="h2">Ordens de Serviço</Typography>
        <Typography variant="bodySmall" color={theme.colors.text.secondary}>
          Visualize e gerencie seus chamados
        </Typography>
      </Block>

      {isLoading && orders.length === 0 ? (
        <HomeSkeleton />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.layout,
            paddingBottom: 100,
          }}
          onRefresh={() => fetchOrders(realm)}
          refreshing={isLoading}
          ListEmptyComponent={
            <Block middle center mt={10}>
              <Typography color={theme.colors.text.light}>
                Nenhuma OS por aqui.
              </Typography>
            </Block>
          }
        />
      )}

      <Block
        style={styles.fabContainer}
        width={60}
        height={60}
        radius={30}
        color={theme.colors.primary[600]}
        shadow="medium"
        middle
        center>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Form')}
          style={styles.fabTouch}>
          <Plus size={30} stroke="white" />
        </TouchableOpacity>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  fabTouch: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

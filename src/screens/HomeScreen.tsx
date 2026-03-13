import React, {useEffect} from 'react';
import {View, FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useQuery, useRealm} from '../models';
import {OrderService} from '../models/OrderService';
import {useOSStore} from '../store/useOSStore';
import {Card} from '../components/card';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({navigation}: Props) => {
  const realm = useRealm();
  const orders = useQuery(OrderService);
  const {isOnline, fetchOrders, isLoading} = useOSStore();

  useEffect(() => {
    fetchOrders(realm);
  }, [isOnline]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.statusBanner,
          {backgroundColor: isOnline ? '#10b981' : '#64748b'},
        ]}>
        <Text style={styles.statusText}>
          {isOnline
            ? '● Online - Sincronizado'
            : '○ Modo Offline - Dados Locais'}
        </Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <Card
            os={item}
            onPress={() => navigation.navigate('Details', {osId: item._id})}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhuma ordem de serviço encontrada.
          </Text>
        }
        onRefresh={() => fetchOrders(realm)}
        refreshing={isLoading}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Form')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f1f5f9'},
  statusBanner: {paddingVertical: 4, alignItems: 'center'},
  statusText: {color: '#fff', fontSize: 12, fontWeight: 'bold'},
  listContent: {padding: 16, paddingBottom: 80},
  emptyText: {textAlign: 'center', marginTop: 50, color: '#94a3b8'},
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2563eb',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {color: '#fff', fontSize: 24, fontWeight: 'bold'},
});

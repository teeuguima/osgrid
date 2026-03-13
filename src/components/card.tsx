import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {OrderService} from '../models/OrderService';

interface Props {
  os: OrderService;
  onPress: () => void;
}

export const Card = ({os, onPress}: Props) => {
  const statusColors = {
    Aberto: '#ef4444',
    'Em Andamento': '#f59e0b',
    Concluído: '#10b981',
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{os.title}</Text>
        <View
          style={[styles.badge, {backgroundColor: statusColors[os.status]}]}>
          <Text style={styles.badgeText}>{os.status}</Text>
        </View>
      </View>

      <Text style={styles.technician}>🔧 Técnico: {os.assignedTo}</Text>
      <Text numberOfLines={2} style={styles.description}>
        {os.description}
      </Text>

      {!os.isSynced && (
        <Text style={styles.syncWarning}>⏳ Aguardando sincronização...</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {fontSize: 16, fontWeight: 'bold', color: '#1e293b'},
  badge: {paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12},
  badgeText: {color: '#fff', fontSize: 11, fontWeight: 'bold'},
  technician: {fontSize: 14, color: '#64748b', marginBottom: 4},
  description: {fontSize: 13, color: '#94a3b8'},
  syncWarning: {
    fontSize: 11,
    color: '#f59e0b',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

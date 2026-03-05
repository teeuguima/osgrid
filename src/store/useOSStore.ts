import {create} from 'zustand';
import api from '../services/api';
import Realm from 'realm';

interface OSState {
  isOnline: boolean;
  isLoading: boolean;
  setOnlineStatus: (status: boolean) => void;
  fetchOrders: (realm: Realm) => Promise<void>;
}

export const useOSStore = create<OSState>((set, get) => ({
  isOnline: false,
  isLoading: false,

  setOnlineStatus: status => {
    const wasOffline = !get().isOnline;
    set({isOnline: status});

    if (wasOffline && status) {
      console.log('Conexão sucedida! Sincronizando...');
    }
  },

  fetchOrders: async (realm: Realm) => {
    set({isLoading: true});

    try {
      if (get().isOnline) {
        const {data} = await api.get('work-orders');
        const orders = data;

        realm.write(() => {
          orders.forEach((order: any) => {
            realm.create(
              'OrderService',
              {
                ...order,
                _id: order.id,
                isSynced: true,
                updatedAt: new Date(order.updatedAt),
              },
              Realm.UpdateMode.Modified,
            );
          });
        });
      }
    } catch (error) {
      console.error('Erro ao buscar ordens:', error);
    } finally {
      set({isLoading: false});
    }
  },
}));

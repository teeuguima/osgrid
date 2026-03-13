import {create} from 'zustand';
import api from '../services/api';
import Realm, {UpdateMode} from 'realm';
import {OrderService} from '../models/OrderService';

interface OSState {
  isOnline: boolean;
  isLoading: boolean;
  setOnlineStatus: (status: boolean, realm?: Realm) => Promise<void>;
  fetchOrders: (realm: Realm) => Promise<void>;
  syncOfflineData: (realm: Realm) => Promise<void>;
  syncDeletedData: (realm: Realm) => Promise<void>;
}

export const useOSStore = create<OSState>((set, get) => ({
  isOnline: false,
  isLoading: false,

  setOnlineStatus: async (status, realm) => {
    const wasOffline = !get().isOnline;
    set({isOnline: status});

    if (wasOffline && status && realm) {
      console.log('⚡ Rede detectada! Sincronizando dados pendentes...');
      await get().syncOfflineData(realm);
    }
  },

  syncOfflineData: async (realm: Realm) => {
    if (!get().isOnline) return;

    const pendingOrders = realm
      .objects<OrderService>('OrderService')
      .filtered('isSynced == false AND deleted == false');

    if (pendingOrders.length === 0) {
      await get().syncDeletedData(realm);
      return;
    }

    const idsToSync = pendingOrders.map(o => o._id);

    for (const id of idsToSync) {
      const os = realm.objectForPrimaryKey<OrderService>('OrderService', id);
      if (!os) continue;

      try {
        if (!get().isOnline) break;

        const isNew = os._id.length >= 13 && !isNaN(Number(os._id));

        const payload = {
          title: os.title,
          description: os.description,
          status: os.status,
          assignedTo: os.assignedTo,
          completed: os.completed,
        };

        let response;
        if (isNew) {
          response = await api.post('/work-orders', payload);
        } else {
          response = await api.put(`/work-orders/${os._id}`, payload);
        }

        if (response.status === 200 || response.status === 201) {
          const remoteData = response.data;

          realm.write(() => {
            if (isNew) {
              realm.delete(os);
              realm.create(
                'OrderService',
                {
                  ...remoteData,
                  _id: String(remoteData.id),
                  isSynced: true,
                  updatedAt: remoteData.updatedAt
                    ? new Date(remoteData.updatedAt)
                    : undefined,
                  createdAt: remoteData.createdAt
                    ? new Date(remoteData.createdAt)
                    : new Date(),
                },
                UpdateMode.Modified,
              );
            } else {
              os.isSynced = true;
            }
          });
        }
      } catch (error) {
        console.error(`Falha ao sincronizar OS ${os._id}:`, error);
      }
    }

    await get().syncDeletedData(realm);
  },

  syncDeletedData: async (realm: Realm) => {
    const deletedOrders = realm
      .objects<OrderService>('OrderService')
      .filtered('deleted == true');

    for (const os of deletedOrders) {
      try {
        const isTemporary = os._id.length >= 13 && !isNaN(Number(os._id));

        if (!isTemporary) {
          await api.delete(`/work-orders/${os._id}`);
        }

        realm.write(() => {
          realm.delete(os);
        });
      } catch (error) {
        console.error('Erro ao sincronizar deleção na API:', error);
      }
    }
  },

  fetchOrders: async (realm: Realm) => {
    if (!get().isOnline) return;
    set({isLoading: true});

    try {
      const {data: remoteOrders} = await api.get('/work-orders');
      const remoteIds = new Set(
        remoteOrders.map((order: any) => String(order.id)),
      );

      realm.write(() => {
        const localSyncedOrders = realm
          .objects<OrderService>('OrderService')
          .filtered('isSynced == true');

        localSyncedOrders.forEach(localOrder => {
          if (!remoteIds.has(localOrder._id)) {
            realm.delete(localOrder);
          }
        });

        remoteOrders.forEach((order: any) => {
          realm.create(
            'OrderService',
            {
              _id: String(order.id),
              title: order.title,
              description: order.description,
              status: order.status,
              assignedTo: order.assignedTo,
              completed: Boolean(order.completed),
              isSynced: true,
              updatedAt: order.updatedAt
                ? new Date(order.updatedAt)
                : undefined,
              createdAt: order.createdAt
                ? new Date(order.createdAt)
                : new Date(),
            },
            UpdateMode.Modified,
          );
        });
      });
    } catch (error) {
      console.error('Erro ao buscar ordens:', error);
    } finally {
      set({isLoading: false});
    }
  },
}));

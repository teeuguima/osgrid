import {create} from 'zustand';
import api from '../services/api';
import Realm, {UpdateMode} from 'realm';
import {OrderService} from '../models/OrderService';
import {AppSettings} from '../models/AppSettings';

interface OSState {
  isOnline: boolean;
  isLoading: boolean;
  lastSync: string | null;
  setOnlineStatus: (status: boolean, realm?: Realm) => Promise<void>;
  fetchOrders: (realm: Realm) => Promise<void>;
  syncOfflineData: (realm: Realm) => Promise<void>;
  syncDeletedData: (realm: Realm) => Promise<void>;
}

export const useOSStore = create<OSState>((set, get) => ({
  isOnline: false,
  isLoading: false,
  lastSync: null,

  setOnlineStatus: async (status, realm) => {
    const wasOffline = !get().isOnline;
    set({isOnline: status});

    if (wasOffline && status && realm) {
      await get().syncOfflineData(realm);
      await get().fetchOrders(realm);
    }
  },

  fetchOrders: async (realm: Realm) => {
    if (get().isLoading || !get().isOnline) return;

    set({isLoading: true});

    try {
      await get().syncOfflineData(realm);
      const settings = realm.objectForPrimaryKey<AppSettings>(
        'AppSettings',
        'config',
      );

      const lastSyncTS = settings?.lastSync || '2000-01-01T00:00:00.000Z';

      const {data} = await api.get('/work-orders/sync', {
        params: {since: lastSyncTS},
      });

      realm.write(() => {
        const remoteUpdates = [
          ...(data.created || []),
          ...(data.updated || []),
        ];
        remoteUpdates.forEach((order: any) => {
          const localVersion = realm.objectForPrimaryKey<OrderService>(
            'OrderService',
            String(order.id),
          );

          if (localVersion && !localVersion.isSynced) return;

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

        if (data.deleted && Array.isArray(data.deleted)) {
          data.deleted.forEach((id: string) => {
            const osToDelete = realm.objectForPrimaryKey<OrderService>(
              'OrderService',
              String(id),
            );
            if (osToDelete && osToDelete.isSynced) {
              realm.delete(osToDelete);
            }
          });
        }

        realm.create(
          'AppSettings',
          {
            _id: 'config',
            lastSync: new Date().toISOString(),
          },
          UpdateMode.Modified,
        );
      });
    } catch (error) {
      console.error('Erro no Delta Sync:', error);
    } finally {
      set({isLoading: false});
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

    for (const os of pendingOrders) {
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

        const response = isNew
          ? await api.post('/work-orders', payload)
          : await api.put(`/work-orders/${os._id}`, payload);

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
                  updatedAt: new Date(remoteData.updatedAt),
                  createdAt: new Date(remoteData.createdAt),
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
        console.error('Erro ao sincronizar deleção:', error);
      }
    }
  },
}));

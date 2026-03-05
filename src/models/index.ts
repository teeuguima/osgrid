import {createRealmContext} from '@realm/react';
import {OrderService} from './OrderService';

const realmConfig: Realm.Configuration = {
  schema: [OrderService],
  schemaVersion: 1,
};

const {RealmProvider, useRealm, useQuery, useObject} =
  createRealmContext(realmConfig);

export {RealmProvider, useRealm, useQuery, useObject};

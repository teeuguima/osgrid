import {createRealmContext} from '@realm/react';
import {OrderService} from './OrderService';
import {AppSettings} from './AppSettings';

const realmConfig: Realm.Configuration = {
  schema: [OrderService, AppSettings],
  schemaVersion: 2,
};

const {RealmProvider, useRealm, useQuery, useObject} =
  createRealmContext(realmConfig);

export {RealmProvider, useRealm, useQuery, useObject};

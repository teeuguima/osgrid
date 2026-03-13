import {Realm} from '@realm/react';

export class AppSettings extends Realm.Object<AppSettings> {
  _id!: string;
  lastSync?: string;

  static schema = {
    name: 'AppSettings',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      lastSync: 'string?',
    },
  };
}

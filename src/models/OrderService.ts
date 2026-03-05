import Realm from 'realm';
import {OSStatus} from '../types/os';

export class OrderService extends Realm.Object<OrderService> {
  _id!: string;
  title!: string;
  description!: string;
  status!: OSStatus;
  assignedTo!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deleted!: boolean;
  isSynced!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'OrderService',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      title: 'string',
      description: 'string',
      status: 'string',
      assignedTo: 'string',
      createdAt: 'date',
      deleted: 'bool',
      updatedAt: 'date',
      isSynced: {type: 'bool', default: false},
    },
  };
}

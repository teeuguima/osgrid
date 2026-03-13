import Realm from 'realm';
import {OSStatus} from '../types/os';

export class OrderService extends Realm.Object<OrderService> {
  _id!: string;
  title!: string;
  description!: string;
  status!: OSStatus;
  assignedTo!: string;
  createdAt!: Date;
  updatedAt?: Date;
  deletedA?: Date;
  completed!: boolean;
  deleted?: boolean;
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
      createdAt: {type: 'date', default: () => new Date()},
      updatedAt: 'date?',
      deletedAt: 'date?',
      completed: {type: 'bool', default: false},
      deleted: {type: 'bool', default: false},
      isSynced: {type: 'bool', default: false},
    },
  };
}

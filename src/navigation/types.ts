import {WorkOrder} from '../types/os';

export type RootStackParamList = {
  Home: undefined;
  Details: {osId: string};
  Form: {os?: WorkOrder};
};

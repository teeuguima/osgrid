import {OSEnumStatus} from '../constants/enums';

export type OSStatus = 'Pending' | 'In Progress' | 'Completed';

export type WorkOrder = {
  id: string;
  title: string;
  description: string;
  status: OSStatus;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  completed: boolean;
  deleted: boolean;
};

export type OSFormData = {
  title: string;
  description: string;
  assignedTo: string;
  status: OSEnumStatus;
  completed: boolean;
  updatedAt?: Date;
};

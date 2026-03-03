export type OSStatus = 'Pending' | 'In Progress' | 'Completed';

export type WorkOrder = {
  id: string;
  title: string;
  description: string;
  status: OSStatus;
  assignedTo: string;
  createdAt: string; // ISODate
  updatedAt: string; // ISODate
  deletedAt?: string; // ISODate
  completed: boolean;
  deleted: boolean;
};

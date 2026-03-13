export enum OSEnumStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export const statusLabels: Record<OSEnumStatus, string> = {
  [OSEnumStatus.PENDING]: 'Pendente',
  [OSEnumStatus.IN_PROGRESS]: 'Em Progresso',
  [OSEnumStatus.COMPLETED]: 'Concluído',
};

export const STATUS_MAP = {
  Pending: {
    variant: 'primary' as const,
  },
  'In Progress': {
    variant: 'primary' as const,
  },
  Completed: {
    variant: 'success' as const,
  },
};

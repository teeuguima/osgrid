export enum OSEnumStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export const statusLabels: Record<OSEnumStatus, string> = {
  [OSEnumStatus.PENDING]: 'Aberto',
  [OSEnumStatus.IN_PROGRESS]: 'Em Progresso',
  [OSEnumStatus.COMPLETED]: 'Concluído',
};

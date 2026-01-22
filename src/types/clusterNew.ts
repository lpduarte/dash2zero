// Novo sistema de clusters dinâmicos

export type OwnerType = 'empresa' | 'municipio';

export interface ClusterDefinition {
  id: string;
  name: string;
  icon: string;
  ownerId: string;
  ownerType: OwnerType;
  createdAt: Date;
  updatedAt: Date;
  isArchived?: boolean;
}

export interface CreateClusterInput {
  name: string;
  icon: string;
}

// Uma empresa pode pertencer a múltiplos clusters
export interface ClusterMembership {
  companyId: string;
  clusterId: string;
  addedAt: Date;
}

export const availableClusterIcons = [
  'Building2',
  'Users',
  'Handshake',
  'ShieldCheck',
  'Eye',
  'Factory',
  'Truck',
  'ShoppingCart',
  'Briefcase',
  'Heart',
  'Leaf',
  'Zap',
  'Home',
  'Coffee',
  'Bed',
  'Store',
] as const;

export type ClusterIconName = typeof availableClusterIcons[number];

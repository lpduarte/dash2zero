// Novo sistema de clusters dinâmicos

export type OwnerType = 'empresa' | 'municipio';

export interface ClusterDefinition {
  id: string;
  name: string;
  icon: string;
  color?: string;
  ownerId: string;
  ownerType: OwnerType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClusterInput {
  name: string;
  icon: string;
  color?: string;
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

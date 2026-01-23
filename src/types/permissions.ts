import { ClientPermissions, PermissionProfile } from './user';

// Permissões padrão por perfil
export const PERMISSION_PROFILES: Record<PermissionProfile, ClientPermissions> = {
  'visualizacao': {
    dashboard: {
      viewKPIs: true,
      viewCharts: true,
      viewSupplierDetails: false,
      useFilters: false,
    },
    clusters: {
      viewKPIs: true,
      viewList: true,
      createCluster: false,
      editCluster: false,
      deleteCluster: false,
      manageCompanies: false,
    },
    incentives: {
      viewKPIs: true,
      viewFunnel: true,
      viewCompanyList: false,
      sendEmails: false,
      manageTemplates: false,
    },
    pipeline: {
      view: false,
      edit: false,
    },
  },
  'gestao-parcial': {
    dashboard: {
      viewKPIs: true,
      viewCharts: true,
      viewSupplierDetails: true,
      useFilters: true,
    },
    clusters: {
      viewKPIs: true,
      viewList: true,
      createCluster: true,
      editCluster: true,
      deleteCluster: false,
      manageCompanies: true,
    },
    incentives: {
      viewKPIs: true,
      viewFunnel: true,
      viewCompanyList: true,
      sendEmails: true,
      manageTemplates: false,
    },
    pipeline: {
      view: true,
      edit: false,
    },
  },
  'gestao-completa': {
    dashboard: {
      viewKPIs: true,
      viewCharts: true,
      viewSupplierDetails: true,
      useFilters: true,
    },
    clusters: {
      viewKPIs: true,
      viewList: true,
      createCluster: true,
      editCluster: true,
      deleteCluster: true,
      manageCompanies: true,
    },
    incentives: {
      viewKPIs: true,
      viewFunnel: true,
      viewCompanyList: true,
      sendEmails: true,
      manageTemplates: true,
    },
    pipeline: {
      view: true,
      edit: true,
    },
  },
};

// Helper para verificar uma permissão específica
export function hasPermission(
  permissions: ClientPermissions,
  module: keyof ClientPermissions,
  action: string
): boolean {
  const modulePerms = permissions[module] as Record<string, boolean>;
  return modulePerms?.[action] ?? false;
}

// Helper para obter perfil mais próximo das permissões atuais
export function detectPermissionProfile(permissions: ClientPermissions): PermissionProfile | 'personalizado' {
  const profiles: PermissionProfile[] = ['visualizacao', 'gestao-parcial', 'gestao-completa'];

  for (const profile of profiles) {
    if (JSON.stringify(permissions) === JSON.stringify(PERMISSION_PROFILES[profile])) {
      return profile;
    }
  }
  return 'personalizado';
}

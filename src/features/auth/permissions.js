export const NAV_ACCESS = {
  dashboard: ['super_admin_technique', 'super_admin_gouvernemental', 'admin_organisation', 'superviseur'],
  organizations: ['super_admin_technique', 'super_admin_gouvernemental'],
  sources: ['super_admin_technique', 'admin_organisation', 'superviseur'],
  resourceTypes: ['super_admin_technique', 'admin_organisation', 'superviseur'],
  lots: ['super_admin_technique', 'admin_organisation', 'superviseur'],
  users: ['super_admin_technique', 'admin_organisation'],
  checkpointScan: ['agent_checkpoint'],
}

export const ACTION_ACCESS = {
  createOrganization: ['super_admin_technique'],
  createSource: ['admin_organisation'],
  createResourceType: ['admin_organisation'],
  createLot: ['admin_organisation'],
  inviteUser: ['super_admin_technique', 'admin_organisation'],
  departLot: ['superviseur'],
  deliverLot: ['superviseur'],
  closePassport: ['admin_organisation', 'superviseur'],
  reportAnomaly: ['agent_checkpoint', 'superviseur'],
  resolveAnomaly: ['superviseur'],
  manageGps: ['admin_organisation', 'superviseur'],
}

export function canAccess(map, key, roleName) {
  return map[key]?.includes(roleName) ?? false
}
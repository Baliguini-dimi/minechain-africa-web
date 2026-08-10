const ROLE_HOME_ROUTES = {
  super_admin_technique: '/',
  super_admin_gouvernemental: '/',
  admin_organisation: '/lots',
  superviseur: '/lots',
  agent_checkpoint: '/checkpoint-scan',
}

export function getRoleHomeRoute(roleName) {
  return ROLE_HOME_ROUTES[roleName] ?? '/lots'
}
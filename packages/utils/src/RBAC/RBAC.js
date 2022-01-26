export async function getRBAC(applicationName = '') {
  const insights = window.insights;
  const user = await insights?.chrome?.auth?.getUser();
  return {
    // eslint-disable-next-line camelcase
    isOrgAdmin: user?.identity?.user?.is_org_admin || false,
    permissions: (await insights?.chrome?.getUserPermissions(applicationName)) || null,
  };
}

export function doesHavePermissions(userPermissions, permissionList) {
  if (!userPermissions) {
    return false;
  }

  return userPermissions.some((access) => {
    return permissionList.includes(access?.permission || access);
  });
}

export default getRBAC;

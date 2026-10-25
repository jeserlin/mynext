export const adminHeaderName = 'x-admin-secret';

export const isAdminAuthorized = (secret: string | string[] | undefined): boolean => {
  if (!process.env.ADMIN_SECRET) {
    return false;
  }

  return secret === process.env.ADMIN_SECRET;
};

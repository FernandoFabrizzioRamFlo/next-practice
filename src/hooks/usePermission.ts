'use client';

import { useUser } from '@/contexts/users/userContext';

export const usePermission = () => {
  const { user } = useUser();

  const hasPermission = (permissionName: string) => {
    if (!user || !user.permissions) {
      return false;
    }
    return user.permissions.includes(permissionName);
  };

  return { hasPermission };
};

import { useMemo } from 'react';
import useAuth from '@hooks/useAuth';
import { clientMenu, companyMenu, counterMenu, superAdminMenu } from '@components/layout/menuItems';
import { filterMenuItems } from '@routes/routePermissions';
import { ROLES } from '@utils/roles';

/**
 * useNavigation — Dynamic navigation hook
 * Generates filtered menu items based on user role and permissions
 */
export const useNavigation = () => {
  const { role, permissions, isSuperAdmin } = useAuth();

  const menuByRole = {
    [ROLES.CLIENT]: clientMenu,
    [ROLES.COMPANY_ADMIN]: companyMenu,
    [ROLES.COUNTER_AGENT]: counterMenu,
    [ROLES.SUPER_ADMIN]: superAdminMenu,
  };

  /**
   * Get filtered menu items for the current user
   * Super admin sees all items without filtering
   */
  const menuItems = useMemo(() => {
    const raw = menuByRole[role] || [];
    if (isSuperAdmin()) return raw;
    return filterMenuItems(raw, role, permissions);
  }, [role, permissions, isSuperAdmin]);

  /**
   * Get a flat list of all accessible paths
   */
  const accessiblePaths = useMemo(() => {
    const paths = [];
    const flatten = (items) => {
      items.forEach((item) => {
        if (item.path) paths.push(item.path);
        if (item.children) flatten(item.children);
      });
    };
    flatten(menuItems);
    return paths;
  }, [menuItems]);

  /**
   * Check if a specific path is in the current user's menu
   */
  const isPathAccessible = useMemo(() => {
    return (path) => accessiblePaths.includes(path);
  }, [accessiblePaths]);

  return {
    menuItems,
    accessiblePaths,
    isPathAccessible,
    role,
  };
};

export default useNavigation;

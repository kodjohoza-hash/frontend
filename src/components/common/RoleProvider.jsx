import { useEffect } from 'react';
import useAuthStore from '@store/auth.store';

const RoleProvider = ({ children }) => {
  const role = useAuthStore((s) => s.role);

  useEffect(() => {
    if (role) {
      document.documentElement.setAttribute('data-role', role);
    } else {
      document.documentElement.removeAttribute('data-role');
    }
    return () => document.documentElement.removeAttribute('data-role');
  }, [role]);

  return children;
};

export default RoleProvider;

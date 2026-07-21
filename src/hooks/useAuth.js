import useAuthStore from '@store/auth.store';
import { authService } from '@services';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useAuth = () => {
  const { token, isAuthenticated, user, logout, setUser, setToken } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setToken(data.data.token);
      setUser(data.data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      logout();
    },
  });

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
    enabled: isAuthenticated && !!token,
    onSuccess: (data) => {
      setUser(data.data);
    },
  });

  return {
    token,
    isAuthenticated,
    user,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    profile: profileQuery.data?.data,
    isProfileLoading: profileQuery.isLoading,
  };
};

export default useAuth;

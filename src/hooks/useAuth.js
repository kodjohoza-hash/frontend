import useAuthStore from '@store/auth.store';
import { authService } from '@services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * BUS TIX CONNECT — useAuth Hook
 * Combines Zustand store + React Query for auth operations
 */
export const useAuth = () => {
  const store = useAuthStore();
  const queryClient = useQueryClient();

  /* ================================================
     MUTATIONS
     ================================================ */
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      const data = response.data;
      store.login({
        user: data.user,
        token: data.token,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      store.logout();
      queryClient.clear();
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email) => authService.forgotPassword(email),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPassword,
  });

  const verifyEmailMutation = useMutation({
    mutationFn: authService.verifyEmail,
  });

  const resendVerificationMutation = useMutation({
    mutationFn: (email) => authService.resendVerification(email),
  });

  /* ================================================
     QUERIES
     ================================================ */
  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
    enabled: store.isAuthenticated && !!store.token,
    onSuccess: (response) => {
      store.setUser(response.data);
    },
  });

  /* ================================================
     RETURN
     ================================================ */
  return {
    /* State */
    token: store.token,
    user: store.user,
    role: store.role,
    permissions: store.permissions,
    isAuthenticated: store.isAuthenticated,
    loading: store.loading,

    /* Login */
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    /* Register */
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    registerSuccess: registerMutation.isSuccess,

    /* Logout */
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    /* Forgot Password */
    forgotPassword: forgotPasswordMutation.mutate,
    isSendingReset: forgotPasswordMutation.isPending,
    forgotPasswordSuccess: forgotPasswordMutation.isSuccess,
    forgotPasswordError: forgotPasswordMutation.error,

    /* Reset Password */
    resetPassword: resetPasswordMutation.mutate,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordSuccess: resetPasswordMutation.isSuccess,
    resetPasswordError: resetPasswordMutation.error,

    /* Verify Email */
    verifyEmail: verifyEmailMutation.mutate,
    isVerifying: verifyEmailMutation.isPending,
    verifyEmailSuccess: verifyEmailMutation.isSuccess,
    verifyEmailError: verifyEmailMutation.error,

    /* Resend Verification */
    resendVerification: resendVerificationMutation.mutate,
    isResending: resendVerificationMutation.isPending,

    /* Profile */
    profile: profileQuery.data?.data,
    isProfileLoading: profileQuery.isLoading,

    /* Helpers */
    hasRole: store.hasRole,
    hasPermission: store.hasPermission,
    hasAnyRole: store.hasAnyRole,
    logoutClean: store.logout,
  };
};

export default useAuth;

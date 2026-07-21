import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '@schemas/auth.schema';
import useAuth from '@hooks/useAuth';
import { PasswordInput, Button } from '@components/ui';

/**
 * ResetPasswordForm — New password form after receiving reset link
 */
const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { resetPassword, isResettingPassword, resetPasswordSuccess, resetPasswordError } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const password = watch('password', '');

  const getPasswordStrength = () => {
    if (!password) return { level: 0, label: '', className: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;

    if (score <= 2) return { level: 1, label: 'Faible', className: 'password-strength__bar--weak' };
    if (score === 3) return { level: 2, label: 'Moyen', className: 'password-strength__bar--medium' };
    return { level: 3, label: 'Fort', className: 'password-strength__bar--strong' };
  };

  const strength = getPasswordStrength();

  const onSubmit = (data) => {
    resetPassword({ token, password: data.password }, {
      onSuccess: () => {
        setTimeout(() => navigate('/login'), 3000);
      },
    });
  };

  if (resetPasswordSuccess) {
    return (
      <div className="auth-status">
        <div className="auth-status__icon auth-status__icon--success">
          <i className="bi bi-check-circle" />
        </div>
        <h2 className="auth-status__title">Mot de passe réinitialisé !</h2>
        <p className="auth-status__text">
          Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion.
        </p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="auth-status">
        <div className="auth-status__icon auth-status__icon--warning">
          <i className="bi bi-exclamation-triangle" />
        </div>
        <h2 className="auth-status__title">Lien invalide</h2>
        <p className="auth-status__text">
          Ce lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
      {resetPasswordError && (
        <div className="auth-alert auth-alert--error" role="alert">
          <i className="bi bi-exclamation-circle auth-alert__icon" />
          <div className="auth-alert__content">
            <p className="auth-alert__message">
              {resetPasswordError?.response?.data?.message || 'Une erreur est survenue. Le lien peut avoir expiré.'}
            </p>
          </div>
        </div>
      )}

      <div>
        <PasswordInput
          label="Nouveau mot de passe"
          name="password"
          placeholder="Minimum 8 caractères"
          autoComplete="new-password"
          error={errors.password?.message}
          disabled={isResettingPassword}
          required
          {...register('password')}
        />
        {password && (
          <div className="password-strength" aria-label={`Force du mot de passe: ${strength.label}`}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`password-strength__bar ${i <= strength.level ? `password-strength__bar--active ${strength.className}` : ''}`}
              />
            ))}
          </div>
        )}
        {password && <span className="password-strength__text">{strength.label}</span>}
      </div>

      <PasswordInput
        label="Confirmer le mot de passe"
        name="confirmPassword"
        placeholder="Retapez votre mot de passe"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        disabled={isResettingPassword}
        required
        {...register('confirmPassword')}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isResettingPassword}
        disabled={isResettingPassword}
      >
        Réinitialiser le mot de passe
      </Button>
    </form>
  );
};

export default ResetPasswordForm;

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@schemas/auth.schema';
import useAuth from '@hooks/useAuth';
import AuthInput from './AuthInput';

const ForgotPasswordForm = () => {
  const { forgotPassword, isSendingReset, forgotPasswordSuccess, forgotPasswordError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data) => forgotPassword(data.email);

  if (forgotPasswordSuccess) {
    return (
      <div className="auth-status">
        <div className="auth-status__icon auth-status__icon--success">
          <i className="bi bi-envelope-check" />
        </div>
        <h2 className="auth-status__title">Email envoyé !</h2>
        <p className="auth-status__text">
          Vérifiez votre boîte de réception et cliquez sur le lien de réinitialisation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
      {forgotPasswordError && (
        <div className="auth-alert auth-alert--error" role="alert">
          <i className="bi bi-exclamation-circle-fill auth-alert__icon" />
          <div className="auth-alert__content">
            <p className="auth-alert__message">
              {forgotPasswordError?.response?.data?.message || 'Aucun compte trouvé avec cette adresse email.'}
            </p>
          </div>
        </div>
      )}

      <AuthInput
        label="Adresse email"
        type="email"
        name="email"
        placeholder="votre@email.com"
        leftIcon={<i className="bi bi-envelope-fill" />}
        error={errors.email?.message}
        disabled={isSendingReset}
        required
        {...register('email')}
      />

      <button type="submit" className="btn btn-primary" disabled={isSendingReset}>
        {isSendingReset && <span className="spinner-border spinner-border-sm" />}
        Envoyer le lien
      </button>
    </form>
  );
};

export default ForgotPasswordForm;

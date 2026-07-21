import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { NotificationProvider } from './NotificationContext';

export const AppProviders = ({ children }) => {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
};

export { AuthProvider, ThemeProvider, NotificationProvider };

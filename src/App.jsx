import { AppProviders } from '@contexts';
import Router from '@routes';
import RoleProvider from '@components/common/RoleProvider';

const App = () => {
  return (
    <AppProviders>
      <RoleProvider>
        <Router />
      </RoleProvider>
    </AppProviders>
  );
};

export default App;

import { AppProviders } from '@contexts';
import Router from '@routes';

const App = () => {
  return (
    <AppProviders>
      <Router />
    </AppProviders>
  );
};

export default App;

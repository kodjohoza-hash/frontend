import { BrowserRouter } from 'react-router-dom';
import AppRouter from './AppRouter';

const Index = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default Index;

import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from '@/components/Theme/theme-provider';
import AppRoutes from './routes';

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AppRoutes />
      </ThemeProvider>
    </Provider>
  );
};

export default App;

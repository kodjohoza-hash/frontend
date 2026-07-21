import { createContext, useMemo } from 'react';
import useTheme from '@hooks/useTheme';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const theme = useTheme();

  const value = useMemo(() => theme, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;

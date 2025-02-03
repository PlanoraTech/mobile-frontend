import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '@/assets/styles/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {}
});

export const ThemeProviderLocal = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme) {
        setTheme(storedTheme as ThemeMode);
      }
      setLoading(false);
    };
    getTheme();
  }, []);
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    AsyncStorage.setItem('theme', theme === 'light' ? 'dark' : 'light');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

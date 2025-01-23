import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const ThemeContext = createContext({} as ThemeContextType );

export const ThemeProvider = ({ children }: {children: React.ReactNode}) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);
  console.log(isDarkTheme);
  const theme = isDarkTheme ? "dark" : "light";
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

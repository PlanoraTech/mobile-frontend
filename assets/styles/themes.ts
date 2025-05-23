
export interface ThemeColors {
  background: string;
  contentBackground: string;
  inputBackground: string;
  border: string;
  text: {
    primary: string;
    secondary: string;
  };

  button: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  switch: {
    track: string;
    trackActive: string;
    thumb: string;
    thumbActive: string;
  };
}

export type ThemeMode = 'light' | 'dark';

export const lightTheme: ThemeColors = {
  background: '#f5f5f5',
  contentBackground: '#FAF9F6',
  inputBackground: '#e0e0e0',
  border: '#e0e0e0',
  text: {
    primary: '#333',
    secondary: '#666'
  },
  button: {
    primary: '#007AFF',
    secondary: '#f44336',
    tertiary: '#33cc33'
  },
  switch: {
    track: '#767577',
    trackActive: '#81b0ff',
    thumb: '#f4f3f4',
    thumbActive: '#f5dd4b'
  }
};

export const darkTheme: ThemeColors = {
  background: '#121212',
  contentBackground: '#1a1a1a',
  inputBackground: '#343434' ,
  border: '#333',
  text: {
    primary: '#fff',
    secondary: '#adadad'
  },
  button: {
    primary: '#11137d',
    secondary: '#BA0021',
    tertiary: '#009900'
  },
  switch: {
    track: '#767577',
    trackActive: '#007AFF', 
    thumb: '#f4f3f4',
    thumbActive: '#f5dd4b'
  }
};

export const getThemeStyles = (theme: ThemeMode) => {
  const colors = theme === 'light' ? lightTheme : darkTheme;
  
  return {
    background: {
      backgroundColor: colors.background,
    },
    content: {
      backgroundColor: colors.contentBackground,
      //borderColor: colors.border,
    },
    text: {
      color: colors.text.primary,
    },
    textSecondary: {
      color: colors.text.secondary, 
    },
    button: {
      backgroundColor: colors.button.primary,
    },
    buttonSecondary: {
      backgroundColor: colors.button.secondary,
    },
    buttonTertiary: {
      backgroundColor: colors.button.tertiary
    },
    switch: {
      track: colors.switch.track,
      trackActive: colors.switch.trackActive,
      thumb: colors.switch.thumb,
      thumbActive: colors.switch.thumbActive
    },
    border: {
      borderBottomColor: colors.border,
    },
    inputBackground: {
      backgroundColor: colors.inputBackground,
    }
  };
};

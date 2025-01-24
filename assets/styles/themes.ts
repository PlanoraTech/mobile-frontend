export const lightTheme = {
  background: '#f5f5f5',
  contentBackground: '#FAF9F6',
  border: '#333',
  text: '#333',
  secondaryText: '#666',
  primary: '#007AFF',
  secondary: '#f44336',
  switchTrack: '#767577',
  switchTrackActive: '#81b0ff',
  switchThumb: '#f4f3f4',
  switchThumbActive: '#f5dd4b'
};

export const darkTheme = {
  background: '#121212',
  contentBackground: '#1a1a1a',
  border: '#333',
  text: '#fff',
  secondaryText: '#adadad',
  primary: '#11137d',
  secondary: '#f44336',
  switchTrack: '#767577',
  switchTrackActive: '#81b0ff',
  switchThumb: '#f4f3f4',
  switchThumbActive: '#f5dd4b'
};

export type Theme = typeof lightTheme;

export const getThemeStyles = (theme: 'light' | 'dark') => {
  const selectedTheme = theme === 'light' ? lightTheme : darkTheme;

  return {
    background: {
      backgroundColor: selectedTheme.background,
    },
    content: {
      backgroundColor: selectedTheme.contentBackground,
      borderColor: selectedTheme.border,
    },
    text: {
      color: selectedTheme.text,
    },
    secondaryText: {
      color: selectedTheme.secondaryText,
    },
    button: {
      backgroundColor: selectedTheme.primary,
    },
    tabBar: {
      backgroundColor: selectedTheme.contentBackground,
      borderTopColor: selectedTheme.border,
    },
    tabHeader: {
      backgroundColor: selectedTheme.contentBackground,
      borderBottomColor: selectedTheme.border,
    },
    primaryText: {
      color: selectedTheme.primary
    },
  };
};


import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Svg, { 
  Rect, 
  Line, 
  Circle, 
  Text, 
  Defs, 
  LinearGradient, 
  Stop, 
  G 
} from 'react-native-svg';

export const PlanoraLogo = ({ width = 120, height = 30 }) => {
  const theme = useTheme();
  
  const primaryColor = theme.colors.primary;
  const secondaryColor = theme.colors.secondary;
  const textColor = theme.colors.onSurface;
  
  return (
    <View style={{ width, height }}>
      <Svg viewBox="0 0 240 60" width="100%" height="100%">
        <Defs>
          <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={primaryColor} />
            <Stop offset="100%" stopColor={secondaryColor} />
          </LinearGradient>
        </Defs>
        
        <G transform="translate(10, 10)">
          <Rect x="0" y="0" width="40" height="40" rx="8" fill="url(#logoGradient)" />
          
          <Rect x="5" y="5" width="30" height="8" rx="2" fill="white" opacity="0.9" />
          
          <Line x1="10" y1="18" x2="10" y2="35" stroke="white" strokeWidth="1.5" opacity="0.6" />
          <Line x1="20" y1="18" x2="20" y2="35" stroke="white" strokeWidth="1.5" opacity="0.6" />
          <Line x1="30" y1="18" x2="30" y2="35" stroke="white" strokeWidth="1.5" opacity="0.6" />
          
          <Line x1="5" y1="18" x2="35" y2="18" stroke="white" strokeWidth="1.5" opacity="0.6" />
          <Line x1="5" y1="27" x2="35" y2="27" stroke="white" strokeWidth="1.5" opacity="0.6" />
          
          <Circle cx="25" cy="22" r="4" fill="white" />
        </G>
        
        <Text 
          x="60" 
          y="36" 
          fontFamily="Arial, sans-serif" 
          fontWeight="700" 
          fontSize="24" 
          fill={textColor}
        >
          Planora
        </Text>
      </Svg>
    </View>
  );
};

export default PlanoraLogo;
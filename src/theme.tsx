// theme.js
interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  cardBackground: string;
  text: string;
  inputBorder: string;
  placeholder: string;
  cardBorder: string;
  buttonText: string;
  hintText: string;
  linkText: string;
}

interface ThemeSpacing {
  small: number;
  medium: number;
  large: number;
  xlarge: number;
}

interface ThemeTypography {
  title: {
    fontSize: number;
    fontWeight: string;
  };
  label: {
    fontSize: number;
    fontWeight: string;
  };
  button: {
    fontSize: number;
    fontWeight: string;
  };
  hint: {
    fontSize: number;
  };
}

export interface RestaurantThemeType {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: {
    small: number;
    medium: number;
    large: number;
  };
  typography: ThemeTypography;
}



export const RestaurantTheme: RestaurantThemeType = {
  colors: {
    primary: '#C41E3A',       // Deep red
    secondary: '#5E3023',     // Warm brown
    background: '#FFF9F2',    // Off-white
    cardBackground: '#FFFFFF',// White
    text: '#5E3023',          // Warm brown
    inputBorder: '#D4A574',   // Light tan
    placeholder: '#A38B74',   // Warm gray
    cardBorder: '#F0E6D2',    // Soft warm border
    buttonText: '#FFFFFF',    // White
    hintText: '#A38B74',      // Warm gray
    linkText: "#4086e2ff"
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
  },
  typography: {
    title: {
      fontSize: 28,
      fontWeight: '800',
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
    },
    button: {
      fontSize: 16,
      fontWeight: '700',
    },
    hint: {
      fontSize: 14,
    },
  },
};
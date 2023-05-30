import React from "react";

export interface ThemeInterface {
  isDark: boolean;
  bodyBackground: string;
  statiscticCardColor: string;
}

export const lightTheme: ThemeInterface = {
  isDark: false,
  bodyBackground: '#ffffff' ,
  statiscticCardColor: '#f5f5f5',
};

export const darkTheme: ThemeInterface = { 
  isDark: true,
  bodyBackground: '#121212',
  statiscticCardColor: '#161616',
};

export const ThemeContext = React.createContext<ThemeInterface>(lightTheme);

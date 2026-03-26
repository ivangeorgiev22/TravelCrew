import {useState, useEffect, createContext} from "react"; 
import type { ReactNode } from 'react'; 
import { DEFAULT_THEME, UpdateRootClassTheme } from "../../styles/themeUtils/themUtils";

type Theme = 'light' | 'dark';
interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  applyTheme: (theme: string) => void;
}
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children: children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [themeToUse, setThemeToUse] = useState<string | null>(DEFAULT_THEME);
  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme') as Theme;
    if (storedTheme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeToUse(storedTheme);
    }
  }, []);
  useEffect(() => {
    if (theme) UpdateRootClassTheme(theme === 'dark');
    if (themeToUse) {
      const themeLink = document.getElementById('theme-link') as HTMLLinkElement | null;
      if (themeLink) {
        themeLink.href = `src/styles/themes/${themeToUse}.css`;
      }
    }
  }, [theme, themeToUse]);
  const applyTheme = (theme: string) => {
    setThemeToUse(theme);
  };
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  return <ThemeContext.Provider value={{ theme, toggleTheme, applyTheme }}>{children}</ThemeContext.Provider>;
};


export { ThemeProvider, ThemeContext};
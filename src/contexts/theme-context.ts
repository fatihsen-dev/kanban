import { createContext } from "react";

export type Theme = "dark" | "light" | "system";

type ThemeProviderState = {
   theme: Theme;
   setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
   theme: "system",
   setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export default ThemeProviderContext;

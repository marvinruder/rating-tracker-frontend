import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material";
import { themeCreator } from "./base";

export const ThemeContext = React.createContext(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (themeName: string): void => {}
);

type ThemeProviderWrapperProps = {
  children: React.ReactNode;
};

const ThemeProviderWrapper: React.FC<ThemeProviderWrapperProps> = (
  props: ThemeProviderWrapperProps
) => {
  const curThemeName = localStorage.getItem("appTheme") || "NebulaFighterTheme";
  const [themeName, _setThemeName] = useState(curThemeName);
  const theme = themeCreator(themeName);
  const setThemeName = (themeName: string): void => {
    localStorage.setItem("appTheme", themeName);
    _setThemeName(themeName);
  };

  useEffect(() => {
    // Add listener to update styles
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) =>
        setThemeName(e.matches ? "NebulaFighterTheme" : "PureLightTheme")
      );

    // Setup dark/light mode for the first time
    setThemeName(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "NebulaFighterTheme"
        : "PureLightTheme"
    );

    // Remove listener
    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", () => {});
    };
  }, []);

  return (
    <ThemeContext.Provider value={setThemeName}>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderWrapper;

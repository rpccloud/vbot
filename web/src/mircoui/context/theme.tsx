import React from "react";
import { Theme } from "../config";

export const ThemeContext = React.createContext<Theme>({
    default: {
        main: "#000",
        hover: "#222",
        highlight: "#444",
        contrastText: "#FFFFFFC0",
    },
    primary: {
        main: "#8e24aa",
        hover: "#9c27b0",
        highlight: "#ab47bc",
        contrastText: "#FFFFFFC0",
    },
    successful: {
        main: "#76ff03",
        contrastText: "#FFFFFFC0",
    },
    failed: {
        main: "#e91e63",
        contrastText: "#FFFFFFC0",
    },
    disabled: {
        main: "#37474f",
        contrastText: "#FFFFFFC0",
    },
});

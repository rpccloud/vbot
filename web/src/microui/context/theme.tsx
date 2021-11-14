import React from "react";
import { Theme } from "../config";

export const ThemeContext = React.createContext<Theme>({
    default: {
        main: "#000",
        contrastText: "#FFFFFFC0",
    },
    primary: {
        main: "#b26500",
        contrastText: "#FFFFFFC0",
    },
    hover: {
        main: "#ff9100",
        contrastText: "#FFFFFFC0",
    },
    highlight: {
        main: "#ffa733",
        contrastText: "#FFFFFFFF",
    },
    focus: {
        main: "#ffa733",
        contrastText: "#FFFFFFC0",
    },
    selected: {
        main: "yellow",
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
        main: "#666",
        contrastText: "#FFFFFFC0",
    },
});

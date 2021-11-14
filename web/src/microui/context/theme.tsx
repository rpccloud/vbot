import React from "react";
import { Theme } from "../config";

export const ThemeContext = React.createContext<Theme>({
    default: {
        main: "#000",
        contrastText: "#FFFFFFC0",
    },
    primary: {
        main: "#00897b",
        contrastText: "#FFFFFFC0",
    },
    hover: {
        main: "#009688",
        contrastText: "#FFFFFFC0",
    },
    highlight: {
        main: "#26a69a",
        contrastText: "#FFFFFFC0",
    },
    focus: {
        main: "#00897b",
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
        contrastText: "#FFFFFF30",
    },
});

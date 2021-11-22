import React from "react";
import { FontWeight, Size } from ".";

export interface Theme {
    palette: {
        primary: {
            main: string;
            hover: string;
            active: string;
            contrastText: string;
        };
        focus: {
            main: string;
            contrastText: string;
        };
        error: {
            main: string;
            contrastText: string;
        };
        success: {
            main: string;
            contrastText: string;
        };
        selected: {
            main: string;
            contrastText: string;
        };
        disabled: {
            main: string;
            contrastText: string;
        };
        outline: string;
        shadow: string;
        divider: string;
        background: string;
    };
    transition: {
        durationMS: number;
        easing: string;
    };
    borderRadius: number;
    size: Size;
    zIndex: number;
    focusable: boolean;
    fontWeight: FontWeight;
}

export const ThemeContext = React.createContext<Theme>({
    palette: {
        primary: {
            main: "#cc7e00",
            hover: "#ff9c00",
            active: "#ffb133",
            contrastText: "#FFFFFFB0",
        },
        focus: {
            main: "#ffa733",
            contrastText: "#FFFFFFD0",
        },
        error: {
            main: "rgb(235, 0, 20)",
            contrastText: "#FFFFFFD0",
        },
        success: {
            main: "#76ff03",
            contrastText: "#FFFFFFD0",
        },
        selected: {
            main: "#ff9100",
            contrastText: "#FFFFFFD0",
        },
        disabled: {
            main: "#555",
            contrastText: "#808080C0",
        },
        background: "rgb(25, 25, 25)",
        shadow: "rgb(200,200,200)",
        outline: "rgb(160, 160, 160)",
        divider: "rgb(80, 80, 80)",
    },
    transition: {
        durationMS: 300,
        easing: "ease-in-out",
    },
    borderRadius: 8,
    size: "medium",
    zIndex: 0,
    focusable: true,
    fontWeight: "normal",
});

import React from "react";
import { FontWeight, Size } from ".";

export interface ITheme {
    palette?: {
        default?: {
            main?: string;
            contrastText?: string;
        };
        primary?: {
            main?: string;
            contrastText?: string;
        };
        hover?: {
            main?: string;
            contrastText?: string;
        };
        active?: {
            main?: string;
            contrastText?: string;
        };
        error?: {
            main?: string;
            contrastText?: string;
        };
        success?: {
            main?: string;
            contrastText?: string;
        };
        selected?: {
            main?: string;
            contrastText?: string;
        };
        disabled?: {
            main?: string;
            contrastText?: string;
        };
        outline?: string;
        shadow?: string;
        divider?: string;
    };
    button?: {
        ghost?: {
            hoverOpacity?: number;
            activeOpacity?: number;
        };
    };
    transition?: {
        durationMS?: number;
        easing?: string;
    };
    borderRadius?: number;
    size?: Size;
    zIndex?: number;
    focus?: {
        focusable?: boolean;
        borderColor?: string;
        borderStyle?: string;
        borderWidth?: number;
    };
    fontWeight?: FontWeight;
}

export interface Theme {
    palette: {
        default: {
            main: string;
            contrastText: string;
        };
        primary: {
            main: string;
            contrastText: string;
        };
        hover: {
            main: string;
            contrastText: string;
        };
        active: {
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
    };
    button: {
        ghost: {
            hoverOpacity: number;
            activeOpacity: number;
        };
    };
    transition: {
        durationMS: number;
        easing: string;
    };
    focus: {
        focusable: boolean;
        borderColor: string;
        borderStyle: string;
        borderWidth: number;
    };
    borderRadius: number;
    size: Size;
    zIndex: number;
    fontWeight: FontWeight;
}

export const ThemeContext = React.createContext<Theme>({
    palette: {
        default: {
            main: "rgb(25, 25, 25)",
            contrastText: "#FFFFFFB0",
        },
        primary: {
            main: "#ff9c00",
            contrastText: "#FFFFFFD0",
        },
        hover: {
            main: "#cc7e00",
            contrastText: "#FFFFFFB0",
        },
        active: {
            main: "#ff9c00",
            contrastText: "#FFFFFFFF",
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
        shadow: "rgb(0,0,0, 0.3)",
        outline: "rgb(160, 160, 160)",
        divider: "rgb(80, 80, 80)",
    },
    button: {
        ghost: {
            hoverOpacity: 0.2,
            activeOpacity: 0.15,
        },
    },
    transition: {
        durationMS: 300,
        easing: "ease-in-out",
    },
    borderRadius: 8,
    size: "medium",
    zIndex: 0,
    focus: {
        focusable: true,
        borderColor: "#8A2BE2",
        borderStyle: "dashed",
        borderWidth: 1,
    },
    fontWeight: "normal",
});

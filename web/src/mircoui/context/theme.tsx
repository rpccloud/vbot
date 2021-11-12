import React from "react";
import { Color, ColorPair, ITheme } from "../config";

export class Theme {
    default: ColorPair;
    primary: ColorPair;
    secondary: ColorPair;
    success: ColorPair;
    warning: ColorPair;
    disabled: ColorPair;

    constructor(o: {
        default: ColorPair;
        primary: ColorPair;
        secondary: ColorPair;
        success: ColorPair;
        warning: ColorPair;
        disabled: ColorPair;
    }) {
        this.default = o.default;
        this.primary = o.primary;
        this.secondary = o.secondary;
        this.success = o.success;
        this.warning = o.warning;
        this.disabled = o.disabled;
    }

    hashKey(): string {
        return [
            this.default.main.hsla,
            this.default.auxiliary.hsla,
            this.primary.main.hsla,
            this.primary.auxiliary.hsla,
            this.secondary.main.hsla,
            this.secondary.auxiliary.hsla,
            this.success.main.hsla,
            this.success.auxiliary.hsla,
            this.warning.main.hsla,
            this.warning.auxiliary.hsla,
            this.disabled.main.hsla,
            this.disabled.auxiliary.hsla,
        ].join("-");
    }

    extend(o: ITheme): Theme {
        return new Theme({
            default: this.default,
            primary: this.primary,
            secondary: this.secondary,
            success: this.success,
            warning: this.warning,
            disabled: this.disabled,
            ...o,
        });
    }
}

export const ThemeContext = React.createContext<Theme>(
    new Theme({
        default: {
            main: new Color(0, 0, 0.9, 1),
            auxiliary: new Color(0, 0, 0.1, 1),
        },
        primary: {
            main: new Color(0, 0, 0.9, 1),
            auxiliary: new Color(32, 1, 0.5, 1),
        },
        secondary: {
            main: new Color(0, 0, 0.7, 1),
            auxiliary: new Color(32, 1, 0.4, 1),
        },
        success: {
            main: new Color(0, 0, 0.9, 1),
            auxiliary: new Color(114, 1, 0.5, 1),
        },
        warning: {
            main: new Color(0, 0, 0.9, 1),
            auxiliary: new Color(0, 1, 0.5, 1),
        },
        disabled: {
            main: new Color(0, 0, 0.4, 1),
            auxiliary: new Color(0, 0, 0.3, 1),
        },
    })
);

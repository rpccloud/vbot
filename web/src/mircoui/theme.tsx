import React from "react";
import { range } from "./util";

const cfgFontSize = {
    tiny: 11,
    small: 14,
    medium: 16,
    large: 20,
    xlarge: 32,
};

const cfgFontWeight = {
    lighter: 200,
    normal: 400,
    bold: 700,
    bolder: 900,
};

export function getFontSize(
    value: "tiny" | "small" | "medium" | "large" | "xlarge"
): number {
    return cfgFontSize[value];
}

export function getFontWeight(value: "lighter" | "normal" | "bold" | "bolder") {
    return cfgFontWeight[value];
}

export class Color {
    private h: number;
    private s: number;
    private l: number;
    private a: number;
    public readonly hsla: string;

    public constructor(h: number, s: number, l: number, a: number) {
        this.h = h;
        this.s = s;
        this.l = l;
        this.a = a;

        const ps = Math.floor(this.s * 100);
        const pl = Math.floor(this.l * 100);

        this.hsla = `hsla(${h}, ${ps}%, ${pl}%, ${a})`;
    }

    lighten(delta: number): Color {
        return new Color(
            this.h,
            this.s,
            range(this.l + delta * 0.05, 0, 1),
            this.a
        );
    }

    darken(delta: number) {
        return new Color(
            this.h,
            this.s,
            range(this.l - delta * 0.05, 0, 1),
            this.a
        );
    }

    alpha(a: number): Color {
        return new Color(this.h, this.s, this.l, a);
    }
}

export interface ColorPair {
    main: Color; // (background, shadow or font)
    auxiliary: Color; // (border, spacer or fort)
}

export interface ColorSet {
    foreground?: Color;
    background?: Color;
    shadow?: string;
    border?: Color;
    auxiliary?: string;
}

export class Theme {
    default: ColorPair;
    primary: ColorPair;
    success: ColorPair;
    warning: ColorPair;
    disabled: ColorPair;

    constructor(o: {
        default: ColorPair;
        primary: ColorPair;
        success: ColorPair;
        warning: ColorPair;
        disabled: ColorPair;
    }) {
        this.default = o.default;
        this.primary = o.primary;
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
            this.success.main.hsla,
            this.success.auxiliary.hsla,
            this.warning.main.hsla,
            this.warning.auxiliary.hsla,
            this.disabled.main.hsla,
            this.disabled.auxiliary.hsla,
        ].join("-");
    }

    assign(o: {
        default?: ColorPair;
        primary?: ColorPair;
        success?: ColorPair;
        warning?: ColorPair;
        disabled?: ColorPair;
    }): Theme {
        return new Theme({
            default: this.default,
            primary: this.primary,
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
            main: new Color(0, 0, 0.1, 1),
            auxiliary: new Color(0, 0, 0.8, 1),
        },
        primary: {
            main: new Color(32, 1, 0.5, 1),
            auxiliary: new Color(0, 0, 0.8, 1),
        },
        success: {
            main: new Color(114, 1, 0.5, 1),
            auxiliary: new Color(0, 0, 0.8, 1),
        },
        warning: {
            main: new Color(0, 1, 0.5, 1),
            auxiliary: new Color(0, 0, 0.8, 1),
        },
        disabled: {
            main: new Color(0, 0, 0.3, 1),
            auxiliary: new Color(0, 0, 0.4, 1),
        },
    })
);

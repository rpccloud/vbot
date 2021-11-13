import React from "react";
import { range } from "./util";

export interface Point {
    x: number;
    y: number;
}

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

const cfgFontSize = {
    tiny: 8,
    small: 11,
    medium: 14,
    large: 18,
    xlarge: 24,
    xxlarge: 48,
};

const cfgFontWeight = {
    lighter: 200,
    normal: 400,
    bold: 700,
    bolder: 900,
};

export function getFontSize(
    value: "tiny" | "small" | "medium" | "large" | "xlarge" | "xxlarge"
): number {
    return cfgFontSize[value];
}

export function getFontWeight(value: "lighter" | "normal" | "bold" | "bolder") {
    return cfgFontWeight[value];
}

export class ITheme {
    default?: ColorPair;
    primary?: ColorPair;
    secondary?: ColorPair;
    success?: ColorPair;
    warning?: ColorPair;
    disabled?: ColorPair;
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
            range(this.l + delta * 0.02, 0, 1),
            this.a
        );
    }

    darken(delta: number) {
        return new Color(
            this.h,
            this.s,
            range(this.l - delta * 0.02, 0, 1),
            this.a
        );
    }

    alpha(a: number): Color {
        return new Color(this.h, this.s, this.l, a);
    }
}

export interface ColorPair {
    main: Color;
    auxiliary: Color;
}

export type ColorSet = {
    font?: string;
    background?: string;
    border?: string;
    shadow?: string;
};

export function extendColorSet(left?: ColorSet, right?: ColorSet): ColorSet {
    if (!right) {
        return left || {};
    } else if (!left) {
        return right;
    } else {
        return {
            font: right.font || left.font,
            background: right.background || left.background,
            border: right.border || left.border,
            shadow: right.shadow || left.shadow,
        };
    }
}

export type ButtonConfig = {
    normal?: ColorSet;
    hover?: ColorSet;
    focus?: ColorSet;
    active?: ColorSet;
    selected?: ColorSet;
    disabled?: ColorSet;
};

export interface InputConfig {
    revertIcon?: React.ReactElement;
    submitIcon?: React.ReactNode;
    editIcon?: React.ReactNode;
    passwordShowIcon?: React.ReactNode;
    passwordHiddenIcon?: React.ReactNode;
    normal?: ColorSet;
    hover?: ColorSet;
    focus?: ColorSet;
    success?: ColorSet;
    warning?: ColorSet;
    placeholderColor?: string;
    validateErrorColor?: string;
}

export interface TabConfig {
    normal?: ColorSet;
    hover?: ColorSet;
    selected?: ColorSet;
}

export interface TabBarConfig {
    tab: TabConfig;
}

export type IConfig =
    | undefined
    | number
    | string
    | boolean
    | Color
    | ColorPair
    | ColorSet
    | { [key: string]: IConfig }
    | React.ReactElement
    | ButtonConfig
    | InputConfig
    | TabConfig
    | TabBarConfig
    | ITheme;

export function getConfigType(v: IConfig): string {
    if (v === undefined) {
        return "undefined";
    } else if (typeof v === "number") {
        return "number";
    } else if (typeof v === "string") {
        return "string";
    } else if (typeof v === "boolean") {
        return "boolean";
    } else if (v instanceof Color) {
        return "Color";
    } else if (React.isValidElement(v)) {
        return "ReactNode";
    } else if (typeof v === "object") {
        return "object";
    } else {
        return "unknown";
    }
}

export function extendConfig(left: IConfig, right: IConfig): IConfig {
    if (left === undefined) {
        return right;
    } else if (right === undefined) {
        return left;
    } else {
        const lType = getConfigType(left);
        const rType = getConfigType(right);

        if (lType === "unknown" || lType !== rType) {
            return undefined;
        }

        if (lType !== "object") {
            return right;
        }

        let oLeft = left as { [key: string]: IConfig };
        let oRight = right as { [key: string]: IConfig };

        let ret: { [key: string]: IConfig } = { ...oLeft };

        for (const key in oRight) {
            if (right.hasOwnProperty(key)) {
                ret[key] = extendConfig(oLeft[key], oRight[key]);
            }
        }

        return ret;
    }
}

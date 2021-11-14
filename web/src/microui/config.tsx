import React from "react";
import { getSeed } from "../app/plugin/browser/utils";

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
    "xx-small": 6,
    "x-small": 9,
    small: 11,
    medium: 14,
    large: 18,
    "x-large": 24,
    "xx-large": 48,
    "xxx-large": 128,
};

export type sizeKind =
    | "xx-small"
    | "x-small"
    | "small"
    | "medium"
    | "large"
    | "x-large"
    | "xx-large"
    | "xxx-large";

export function getFontSize(value: sizeKind): number {
    return cfgFontSize[value];
}

export interface PaletteColor {
    main?: string;
    contrastText?: string;
}

export type ComponentColor = {
    font?: string;
    background?: string;
    border?: string;
    shadow?: string;
};

export interface Theme {
    default?: PaletteColor;
    primary?: PaletteColor;
    hover?: PaletteColor;
    highlight?: PaletteColor;
    focus?: PaletteColor;
    selected?: PaletteColor;
    successful?: PaletteColor;
    failed?: PaletteColor;
    disabled?: PaletteColor;
}

export type ButtonConfig = {
    primary?: ComponentColor;
    hover?: ComponentColor;
    focus?: ComponentColor;
    highlight?: ComponentColor;
    selected?: ComponentColor;
    disabled?: ComponentColor;
};

export interface InputConfig {
    revertIcon?: React.ReactElement;
    submitIcon?: React.ReactElement;
    editIcon?: React.ReactElement;
    passwordShowIcon?: React.ReactElement;
    passwordHiddenIcon?: React.ReactElement;
    primary?: ComponentColor;
    hover?: ComponentColor;
    highlight?: ComponentColor;
    focus?: ComponentColor;
    successful?: ComponentColor;
    failed?: ComponentColor;
    placeholderColor?: string;
    validateErrorColor?: string;
}

export interface TabConfig {
    primary?: ComponentColor;
    hover?: ComponentColor;
    highlight?: ComponentColor;
}

export interface TabBarConfig {
    tab: TabConfig;
}

function getConfigType(v: any): string {
    if (React.isValidElement(v)) {
        return "ReactNode";
    } else {
        return typeof v;
    }
}

export function extendConfig(left: any, right: any): any {
    if (left === undefined) {
        return right;
    } else if (right === undefined) {
        return left;
    } else {
        const lType = getConfigType(left);
        const rType = getConfigType(right);

        if (lType !== rType) {
            return undefined;
        }

        if (lType !== "object") {
            return right;
        }

        let oLeft = left as { [key: string]: any };
        let oRight = right as { [key: string]: any };

        let ret: { [key: string]: any } = { ...oLeft };

        for (const key in oRight) {
            if (right.hasOwnProperty(key)) {
                ret[key] = extendConfig(oLeft[key], oRight[key]);
            }
        }

        return ret;
    }
}

const themeIDPropertyName = "@-micro-ui-theme-id-#";

export function extendTheme(left: Theme, right: Theme | undefined): Theme {
    const leftHash = getThemeHashKey(left);
    const rightHash = getThemeHashKey(right);
    const ret = extendConfig(left, right);
    ret[themeIDPropertyName] = `${leftHash}-${rightHash}`;
    return ret;
}

export function getThemeHashKey(theme: Theme | undefined): string {
    if (theme === undefined) {
        return "";
    }

    let o = theme as { [key: string]: any };

    if (o.hasOwnProperty(themeIDPropertyName)) {
        return o[themeIDPropertyName];
    } else {
        o[themeIDPropertyName] = `${getSeed()}`;
        return o[themeIDPropertyName];
    }
}
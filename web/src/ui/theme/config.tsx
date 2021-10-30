import React from "react";
import { makeAutoObservable } from "mobx";
import { ConfigProvider } from "antd";

import "antd/dist/antd.variable.min.css";
import "./base/base.scss";
import "./base/antd.scss";
import { range } from "../util/util";

export class Color {
    h: number;
    s: number;
    l: number;
    a: number;
    hsla: string;

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

    // colorL(l: number): Color {
    //     return new Color(this.h, this.s, l, this.a);
    // }

    alpha(a: number): Color {
        return new Color(this.h, this.s, this.l, a);
    }
}

export function HSLA(h: number, s: number, l: number, a: number): Color {
    return new Color(h, s, l, a);
}

export interface IColorUnit {
    font?: string;
    border?: string;
    shadow?: string;
    background?: string;
}

export const config = {
    // light: {
    //     default: {
    //         primaryColor: "rgb(125, 60, 152)",
    //         infoColor: "rgb(44, 105, 238)",
    //         successColor: "rgb(27, 199, 21)",
    //         processingColor: "rgb(218, 189, 24)",
    //         errorColor: "rgb(236, 20, 20)",
    //         warningColor: "rgb(185, 78, 64)",
    //         backgroundColor: "rgb(235, 237, 240)",
    //         backgroundColorLighten: "rgb(250, 252, 255)",
    //         backgroundColorDarken: "rgb(225, 227, 230)",
    //         fontColor: "rgba(0, 0, 0, 0.8)",
    //         fontColorLighten: "rgba(0, 0, 0, 0.6)",
    //         fontColorDarken: "rgba(0, 0, 0, 1)",
    //         borderColor: "rgb(180, 180, 180)",
    //         borderColorLighten: "rgb(200, 200, 200)",
    //         borderColorDarken: "rgb(100, 100, 100)",
    //         shadowColor: "rgb(170, 170, 170)",
    //         dividerColor: "rgb(210, 210, 210)",
    //         disabledColor: "rgb(195, 195, 195)",
    //         disabledBackground: "rgb(235, 235, 235)",
    //     },
    // },
    dark: {
        default: {
            primaryColor: HSLA(32, 1, 0.5, 1),
            auxiliaryColor: HSLA(301, 1, 0.5, 1),
            foregroundColor: HSLA(0, 0, 0.8, 1),
            backgroundColor: HSLA(0, 0, 0.1, 1),
            successColor: HSLA(114, 1, 0.5, 1),
            warningColor: HSLA(0, 1, 0.5, 1),
            disabledColor: HSLA(0, 0, 0.4, 1),
        },
    },
};

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

export class ThemeConfig {
    primaryColor: Color;
    auxiliaryColor: Color;
    foregroundColor: Color;
    backgroundColor: Color;
    successColor: Color;
    warningColor: Color;
    disabledColor: Color;

    constructor(o: {
        primaryColor: Color;
        auxiliaryColor: Color;
        foregroundColor: Color;
        backgroundColor: Color;
        successColor: Color;
        warningColor: Color;
        disabledColor: Color;
    }) {
        makeAutoObservable(this);
        this.primaryColor = o.primaryColor;
        this.auxiliaryColor = o.auxiliaryColor;
        this.foregroundColor = o.foregroundColor;
        this.backgroundColor = o.backgroundColor;
        this.successColor = o.successColor;
        this.warningColor = o.warningColor;
        this.disabledColor = o.disabledColor;
    }

    hashKey(): string {
        return [
            this.primaryColor.hsla,
            this.auxiliaryColor.hsla,
            this.foregroundColor.hsla,
            this.backgroundColor.hsla,
            this.foregroundColor.hsla,
            this.foregroundColor.hsla,
            this.foregroundColor.hsla,
        ].join("-");
    }

    assign(o: any): ThemeConfig {
        return new ThemeConfig({
            primaryColor: this.primaryColor,
            auxiliaryColor: this.auxiliaryColor,
            foregroundColor: this.foregroundColor,
            backgroundColor: this.backgroundColor,
            successColor: this.successColor,
            warningColor: this.warningColor,
            disabledColor: this.disabledColor,
            ...o,
        });
    }

    flushToAntd() {
        ConfigProvider.config({
            theme: {
                primaryColor: this.foregroundColor.hsla,
                warningColor: this.warningColor.hsla,
            },
        });
    }

    private static instance = new ThemeConfig(config.dark.default);
    static get(): ThemeConfig {
        return ThemeConfig.instance;
    }
}

export const ThemeContext = React.createContext<ThemeConfig>(ThemeConfig.get());

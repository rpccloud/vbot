import React from "react";

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

export type ActionState = {
    isHover: boolean;
    isActive: boolean;
    isSelected: boolean;
};

export type ColorSet = {
    normal?: string;
    hover?: string;
    active?: string;
    selected?: string;
};

export function getStateColor(
    colorSet: ColorSet | undefined,
    state: ActionState
): string {
    if (state.isSelected) {
        return colorSet?.selected || "transparent";
    } else if (state.isActive) {
        return colorSet?.active || "transparent";
    } else if (state.isHover) {
        return colorSet?.hover || "transparent";
    } else {
        return colorSet?.normal || "transparent";
    }
}

export type ShadowSet = {
    normal?: string;
    hover?: string;
    active?: string;
};

export function getStateShadow(
    shadowSet: ShadowSet | undefined,
    state: ActionState
): string {
    if (state.isActive) {
        return shadowSet?.active || "transparent";
    } else if (state.isHover) {
        return shadowSet?.hover || "transparent";
    } else {
        return shadowSet?.normal || "transparent";
    }
}

const cfgFontSize = {
    "xxx-small": 6,
    "xx-small": 8,
    "x-small": 10,
    small: 12,
    medium: 14,
    large: 16,
    "x-large": 20,
    "xx-large": 32,
    "xxx-large": 64,
};

export type FontWeight = "normal" | "bold" | "bolder" | "lighter";

export type Size =
    | "xxx-small"
    | "xx-small"
    | "x-small"
    | "small"
    | "medium"
    | "large"
    | "x-large"
    | "xx-large"
    | "xxx-large";

export function getFontSize(value: Size): number {
    return cfgFontSize[value];
}

export function makeTransition(
    attrs: Array<string>,
    duration?: string,
    easing?: string
): string {
    const vArray = attrs.map((v) => {
        return `${v} ${duration} ${easing}`;
    });

    return vArray.join(",");
}

export function withDefault(...args: any[]): any {
    for (let i = 0; i < args.length; i++) {
        if (args[i] !== undefined) {
            return args[i];
        }
    }

    return undefined;
}

export function extendConfig(left: any, right: any): any {
    if (left === undefined) {
        return right;
    } else if (right === undefined) {
        return left;
    } else {
        const lType = React.isValidElement(left) ? "ReactNode" : typeof left;
        const rType = React.isValidElement(right) ? "ReactNode" : typeof right;

        if (lType !== rType) {
            return undefined;
        }

        if (lType !== "object") {
            return right;
        }

        let oLeft = left as { [key: string]: any };
        let oRight = right as { [key: string]: any };

        let ret = { ...oLeft };

        for (const key in oRight) {
            if (right.hasOwnProperty(key)) {
                ret[key] = extendConfig(oLeft[key], oRight[key]);
            }
        }

        return ret;
    }
}
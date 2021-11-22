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
    "xxx-small": 5,
    "xx-small": 8,
    "x-small": 11,
    small: 14,
    medium: 16,
    large: 20,
    "x-large": 32,
    "xx-large": 64,
    "xxx-large": 128,
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

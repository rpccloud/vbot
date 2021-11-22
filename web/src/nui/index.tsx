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

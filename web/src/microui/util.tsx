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

const cfgFontSize = {
    "xx-small": 7,
    "x-small": 10,
    small: 12,
    medium: 14,
    large: 16,
    "x-large": 22,
    "xx-large": 32,
    "xxx-large": 64,
};

export type Size =
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

export interface Transition {
    durationMS: number;
    easing: string;
}

export interface DefaultColor {
    pageBackground?: string;
    contrastText?: string;
    outline?: string;
    divider?: string;
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

        let ret: { [key: string]: any } = { ...oLeft };

        for (const key in oRight) {
            if (right.hasOwnProperty(key)) {
                ret[key] = extendConfig(oLeft[key], oRight[key]);
            }
        }

        return ret;
    }
}

export async function sleep(timeMS: number) {
    return new Promise((resolve) => setTimeout(resolve, timeMS));
}

export function range(v: number, min: number, max: number): number {
    if (v < min) {
        v = min;
    }

    if (v > max) {
        v = max;
    }

    return v;
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

interface TimeListener {
    onTimer(timeMS: number): void;
}

export class TimerManager {
    private static instance = new TimerManager();

    private timer?: number;
    private timeNowMS: number;
    private slowMap = new Map<number, TimeListener>();
    private fastMap = new Map<number, TimeListener>();
    private timeCount = 0;
    private seed: number = 1;

    public static get(): TimerManager {
        return TimerManager.instance;
    }

    constructor() {
        this.timeNowMS = new Date().getTime();
        this.timer = window.setInterval(this.onTimer.bind(this), 25);
    }

    getNowMS() {
        return this.timeNowMS;
    }

    onTimer() {
        this.timeNowMS = new Date().getTime();
        this.timeCount++;

        if (this.timeCount % 10 === 0) {
            this.slowMap.forEach((it) => {
                it.onTimer(this.timeNowMS);
            });
        }

        this.fastMap.forEach((it) => {
            it.onTimer(this.timeNowMS);
        });
    }

    attach(item: TimeListener): number {
        const seed = this.seed++;
        this.slowMap.set(seed, item);
        return seed;
    }

    detach(id: number): boolean {
        const retSlow = this.slowMap.delete(id);
        const retFast = this.fastMap.delete(id);
        return retSlow || retFast;
    }

    slow(id: number) {
        const item = this.fastMap.get(id);
        if (item) {
            this.fastMap.delete(id);
            this.slowMap.set(id, item);
        }
        return this.slowMap.has(id);
    }

    fast(id: number): boolean {
        const item = this.slowMap.get(id);
        if (item) {
            this.slowMap.delete(id);
            this.fastMap.set(id, item);
        }
        return this.fastMap.has(id);
    }

    close() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
}

export class SeedManager {
    private static seed = 1;
    public static getSeed() {
        return SeedManager.seed++;
    }
}

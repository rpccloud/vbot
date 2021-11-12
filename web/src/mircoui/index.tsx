import React from "react";

export class ITheme {
    default?: ColorPair;
    primary?: ColorPair;
    secondary?: ColorPair;
    success?: ColorPair;
    warning?: ColorPair;
    disabled?: ColorPair;
}

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
    large: 16,
    xlarge: 20,
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
    timeMS: number,
    timingFunc: string
): string {
    const vArray = attrs.map((v) => {
        return `${v} ${timeMS}ms ${timingFunc}`;
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

export class ThemeCache {
    private configMap = new Map<string, { timeMS: number; config: any }>();
    private timer: number;

    constructor() {
        this.timer = TimerManager.get().attach(this);
    }

    onTimer(nowMS: number): void {
        this.configMap.forEach((item, key) => {
            if (nowMS - item.timeMS > 10000) {
                this.configMap.delete(key);
            }
        });
    }

    getConfig(key: string): any {
        let item = this.configMap.get(key);

        if (item) {
            item.timeMS = TimerManager.get().getNowMS();
            this.configMap.set(key, item);
            return item.config;
        } else {
            return null;
        }
    }

    setConfig(key: string, config: any) {
        this.configMap.set(key, {
            timeMS: TimerManager.get().getNowMS(),
            config: config,
        });
    }
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

export interface ColorSet {
    font?: string;
    background?: string;
    border?: string;
    shadow?: string;
    auxiliary?: string;
}

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
            auxiliary: right.auxiliary || left.auxiliary,
        };
    }
}

export class SeedManager {
    private static seed = 1;
    public static getSeed() {
        return SeedManager.seed++;
    }
}

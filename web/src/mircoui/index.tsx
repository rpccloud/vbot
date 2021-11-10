import React from "react";

interface TimeListener {
    onTimer(timeMS: number): void;
}

class TimerManager {
    private timer?: number;
    private timeNowMS: number;
    private slowMap = new Map<number, TimeListener>();
    private fastMap = new Map<number, TimeListener>();
    private timeCount = 0;
    private seed: number = 1;

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

export const gTimerManager = new TimerManager();

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

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
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

export class ThemeCache {
    private configMap = new Map<string, { timeMS: number; config: any }>();
    private timer: number;

    constructor() {
        this.timer = gTimerManager.attach(this);
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
            item.timeMS = gTimerManager.getNowMS();
            this.configMap.set(key, item);
            return item.config;
        } else {
            return null;
        }
    }

    setConfig(key: string, config: any) {
        this.configMap.set(key, {
            timeMS: gTimerManager.getNowMS(),
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

export class ITheme {
    default?: ColorPair;
    primary?: ColorPair;
    secondary?: ColorPair;
    success?: ColorPair;
    warning?: ColorPair;
    disabled?: ColorPair;
}

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

interface Focus {
    focusable: boolean;
}

export const FocusContext = React.createContext<Focus>({
    focusable: true,
});

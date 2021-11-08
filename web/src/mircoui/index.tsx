import React from "react";

let seed = 0;
function getSeed(): number {
    return seed++;
}

let gResizeSensorFastMap = new Map<number, ResizeSensor>();
let gResizeSensorSlowMap = new Map<number, ResizeSensor>();
let gThemeCacheList = Array<ThemeCache>();
let gThemeCacheNowMS = getTimeMS();
let gTimerCount = 0;

window.setInterval(() => {
    gTimerCount++;

    if (gTimerCount % 20 === 0) {
        gThemeCacheNowMS = getTimeMS();
        gThemeCacheList.forEach((it) => {
            it.onTimer();
        });
    }

    if (gTimerCount % 10 === 0) {
        gResizeSensorSlowMap.forEach((it) => {
            it.onTimer();
        });
    }

    gResizeSensorFastMap.forEach((it) => {
        it.onTimer();
    });
}, 25);

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

export function getTimeMS(): number {
    return new Date().getTime();
}

function elementMatches(
    elem: Element | null,
    state: string,
    matchChildren: boolean
): boolean {
    if (!elem) {
        return false;
    }

    if (elem.matches(state)) {
        return true;
    }

    if (matchChildren) {
        for (let child of elem.children) {
            if (elementMatches(child, state, true)) {
                return true;
            }
        }
    }

    return false;
}

export class TimerValue {
    private durationMS: number;
    private defaultValue: any;
    private currentValue: any;
    private onValueChange: (value: any) => void;

    private timer?: number;
    private startMS?: number;

    constructor(
        durationMS: number,
        defaultValue: any,
        onValueChange: (value: any) => void
    ) {
        this.durationMS = durationMS;
        this.defaultValue = defaultValue;
        this.currentValue = defaultValue;
        this.onValueChange = onValueChange;
    }

    public setValue(value: any) {
        if (value !== this.currentValue) {
            this.currentValue = value;
            this.onValueChange(this.currentValue);
        }

        if (value !== this.defaultValue) {
            this.check();
        }
    }

    private check() {
        this.startMS = getTimeMS();

        if (!this.timer) {
            this.timer = window.setInterval(() => {
                if (
                    !this.startMS ||
                    getTimeMS() - this.startMS > this.durationMS
                ) {
                    this.setValue(this.defaultValue);
                    this.depose();
                }
            }, 25);
        }
    }

    public depose() {
        if (this.timer) {
            window.clearInterval(this.timer);
            this.timer = undefined;
        }
    }
}

export class HtmlChecker {
    private ref: React.RefObject<HTMLElement | SVGElement>;
    private fnLostHover?: () => void;
    private fnLostActive?: () => void;
    private fnLostFocus?: () => void;
    timer?: number;

    constructor(ref: React.RefObject<HTMLElement | SVGElement>) {
        this.ref = ref;
    }

    onLostFocus(fn: () => void) {
        this.fnLostFocus = fn;
        this.onCheck();
    }

    onLostHover(fn: () => void) {
        this.fnLostHover = fn;
        this.onCheck();
    }

    onLostActive(fn: () => void) {
        this.fnLostActive = fn;
        this.onCheck();
    }

    public hasActive(): boolean {
        return elementMatches(this.ref.current, ":active", true);
    }

    public hasHover(): boolean {
        return elementMatches(this.ref.current, ":hover", true);
    }

    public hasFocus(): boolean {
        return elementMatches(this.ref.current, ":focus", true);
    }

    private onCheck() {
        if (!this.timer) {
            this.timer = window.setInterval(() => {
                this.onTimer();
                if (
                    !this.fnLostFocus &&
                    !this.fnLostHover &&
                    !this.fnLostActive
                ) {
                    this.depose();
                }
            }, 25);
        }
    }

    public depose() {
        if (this.timer) {
            window.clearInterval(this.timer);
            this.timer = undefined;
        }

        this.lostHover();
        this.lostActive();
        this.lostFocus();
    }

    private lostHover() {
        if (this.fnLostHover) {
            this.fnLostHover();
            this.fnLostHover = undefined;
        }
    }

    private lostActive() {
        if (this.fnLostActive) {
            this.fnLostActive();
            this.fnLostActive = undefined;
        }
    }

    private lostFocus() {
        if (this.fnLostFocus) {
            this.fnLostFocus();
            this.fnLostFocus = undefined;
        }
    }

    private onTimer() {
        if (this.fnLostHover) {
            if (!this.hasHover()) {
                this.lostHover();
            }
        }

        if (!!this.fnLostActive) {
            if (!this.hasActive()) {
                this.lostActive();
            }
        }

        if (this.fnLostFocus) {
            if (!this.hasFocus()) {
                this.lostFocus();
            }
        }
    }
}

export interface ScreenRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

function isScreenRectEqual(left?: ScreenRect, right?: ScreenRect): boolean {
    if (left === undefined && right === undefined) {
        return true;
    }

    return (
        left?.x === right?.x &&
        left?.y === right?.y &&
        left?.width === right?.width &&
        left?.height === right?.height
    );
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

export class ResizeSensor {
    private id: number = getSeed();
    private ref: React.RefObject<HTMLElement>;
    private onResize: (rect?: ScreenRect) => void;
    private rect?: ScreenRect;

    constructor(
        ref: React.RefObject<HTMLElement>,
        onResize: (rect?: ScreenRect) => void
    ) {
        this.ref = ref;
        this.onResize = onResize;
        this.listenSlow();
    }

    listenFast() {
        gResizeSensorSlowMap.delete(this.id);
        gResizeSensorFastMap.set(this.id, this);
    }

    listenSlow() {
        gResizeSensorFastMap.delete(this.id);
        gResizeSensorSlowMap.set(this.id, this);
    }

    onTimer() {
        let rect = this.ref.current
            ? this.ref.current.getBoundingClientRect()
            : undefined;

        if (!isScreenRectEqual(rect, this.rect)) {
            this.rect = rect;
            this.onResize(rect);
        }
    }

    close() {
        gResizeSensorSlowMap.delete(this.id);
        gResizeSensorFastMap.delete(this.id);
    }
}

export class ThemeCache {
    private configMap = new Map<string, { timeMS: number; config: any }>();

    constructor() {
        gThemeCacheList.push(this);
    }

    onTimer(): void {
        this.configMap.forEach((item, key) => {
            if (gThemeCacheNowMS - item.timeMS > 10000) {
                this.configMap.delete(key);
            }
        });
    }

    getConfig(key: string): any {
        let item = this.configMap.get(key);

        if (item) {
            item.timeMS = gThemeCacheNowMS;
            this.configMap.set(key, item);
            return item.config;
        } else {
            return null;
        }
    }

    setConfig(key: string, config: any) {
        this.configMap.set(key, { timeMS: gThemeCacheNowMS, config: config });
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

export interface Point {
    x: number;
    y: number;
}

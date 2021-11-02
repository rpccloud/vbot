import React from "react";

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
            }, 60);
        }
    }

    private depose() {
        if (this.timer) {
            window.clearInterval(this.timer);
            this.timer = undefined;
        }
    }
}

export class HtmlChecker {
    private ref: React.RefObject<HTMLElement>;
    private fnLostHover?: () => void;
    private fnLostActive?: () => void;
    private fnLostFocus?: () => void;
    timer?: number;

    constructor(ref: any) {
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
        this.fnLostHover = fn;
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
            }, 60);
        }
    }

    private depose() {
        this.onTimer();
        this.fnLostHover = undefined;
        this.fnLostActive = undefined;
        this.fnLostFocus = undefined;

        if (this.timer) {
            window.clearInterval(this.timer);
            this.timer = undefined;
        }
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

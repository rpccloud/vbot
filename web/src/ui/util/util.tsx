export function range(v: number, min: number, max: number): number {
    if (v < min) {
        v = min;
    }

    if (v > max) {
        v = max;
    }

    return v;
}

function hasState(elem: Element, state: string): boolean {
    if (elem) {
        if (elem.matches(state)) {
            return true;
        }

        for (let i = 0; i < elem.children.length; i++) {
            if (hasState(elem.children[i], state)) {
                return true;
            }
        }
    }

    return false;
}

function getTimeMS(): number {
    return new Date().getTime();
}

export class TimerValue {
    private duration: number;
    private defaultValue: any;
    private value: any;
    private timer?: number;
    private startMS?: number;
    private onValueChange: (value: any) => void;
    constructor(
        duration: number,
        defaultValue: any,
        onValueChange: (value: any) => void
    ) {
        this.defaultValue = defaultValue;
        this.value = defaultValue;
        this.duration = duration;
        this.onValueChange = onValueChange;
    }

    public setValue(value: any) {
        if (value !== this.value) {
            this.value = value;
            this.onValueChange(this.value);
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
                    getTimeMS() - this.startMS > this.duration
                ) {
                    window.clearInterval(this.timer);
                    this.timer = undefined;
                    this.setValue(this.defaultValue);
                }
            }, 50);
        }
    }
}

export class HtmlChecker {
    ref: any;
    fnLostFocus?: () => void;
    fnLostHover?: () => void;
    fnLostActive?: () => void;
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

    private onCheck() {
        if (!this.timer) {
            if (!!this.fnLostFocus || !!this.fnLostHover || !!this.hasActive) {
                this.timer = window.setInterval(() => {
                    this.onTimer();
                }, 60);
            }
        }
    }

    hasActive(): boolean {
        return hasState(this.ref.current, ":active");
    }

    hasHover(): boolean {
        return hasState(this.ref.current, ":hover");
    }

    hasFocus(): boolean {
        return hasState(this.ref.current, ":focus");
    }

    private onTimer() {
        const elem = this.ref.current;
        if (elem) {
            if (!!this.fnLostFocus) {
                if (!this.hasFocus()) {
                    this.fnLostFocus();
                    this.fnLostFocus = undefined;
                }
            }

            if (!!this.fnLostHover) {
                if (!this.hasHover()) {
                    this.fnLostHover();
                    this.fnLostHover = undefined;
                }
            }

            if (!!this.fnLostActive) {
                if (!this.hasActive()) {
                    this.fnLostActive();
                    this.fnLostActive = undefined;
                }
            }

            if (!this.fnLostFocus && !this.fnLostHover && !this.fnLostActive) {
                window.clearInterval(this.timer);
                this.timer = undefined;
            }
        }
    }
}

export function range(v: number, min: number, max: number): number {
    if (v < min) {
        v = min;
    }

    if (v > max) {
        v = max;
    }

    return v;
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
        const elem = this.ref.current;
        if (elem) {
            return elem.matches(":active");
        } else {
            return false;
        }
    }

    hasFocus(): boolean {
        const elem = this.ref.current;
        if (elem) {
            return elem.matches(":focus");
        } else {
            return false;
        }
    }

    hasHover(): boolean {
        const elem = this.ref.current;
        if (elem) {
            return elem.matches(":hover");
        } else {
            return false;
        }
    }

    private onTimer() {
        const elem = this.ref.current;
        if (elem) {
            if (!!this.fnLostFocus) {
                if (!elem.matches(":focus")) {
                    this.fnLostFocus();
                    this.fnLostFocus = undefined;
                }
            }

            if (!!this.fnLostHover) {
                if (!elem.matches(":hover")) {
                    this.fnLostHover();
                    this.fnLostHover = undefined;
                }
            }

            if (!!this.fnLostActive) {
                if (!elem.matches(":active")) {
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

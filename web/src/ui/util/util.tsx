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

        for (let child of elem.children) {
            if (hasState(child, state)) {
                return true;
            }
        }
    }

    return false;
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

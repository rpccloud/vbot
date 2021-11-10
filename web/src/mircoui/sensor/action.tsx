import { gTimerManager } from "..";

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

export class ActionSensor {
    private refs: React.RefObject<Element>[];
    private fnLostHover?: () => void;
    private fnLostActive?: () => void;
    private fnLostFocus?: () => void;
    private timer?: number;

    constructor(refs: React.RefObject<Element>[]) {
        this.refs = refs;
    }

    public checkHover(onHover: () => void, onLostHover: () => void) {
        if (this.hasAction("hover") && this.fnLostHover === undefined) {
            onHover();
            this.fnLostHover = onLostHover;
            this.check();
        }
    }

    public checkFocus(onFocus: () => void, onLostFocus: () => void) {
        if (this.hasAction("focus") && this.fnLostFocus === undefined) {
            onFocus();
            this.fnLostFocus = onLostFocus;
            this.check();
        }
    }

    public checkActive(onActive: () => void, onLostActive: () => void) {
        if (this.hasAction("active") && this.fnLostActive === undefined) {
            onActive();
            this.fnLostActive = onLostActive;
            this.check();
        }
    }

    private hasAction(action: string): boolean {
        for (const ref of this.refs) {
            if (elementMatches(ref.current, `:${action}`, true)) {
                return true;
            }
        }

        return false;
    }

    private check() {
        if (!this.timer && this.refs.length > 0) {
            this.timer = gTimerManager.attach(this);
            gTimerManager.fast(this.timer);
        }
    }

    public onTimer() {
        if (this.fnLostHover) {
            if (!this.hasAction("hover")) {
                this.fnLostHover();
                this.fnLostHover = undefined;
            }
        }

        if (this.fnLostActive) {
            if (!this.hasAction("active")) {
                this.fnLostActive();
                this.fnLostActive = undefined;
            }
        }

        if (this.fnLostFocus) {
            if (!this.hasAction("focus")) {
                this.fnLostFocus();
                this.fnLostFocus = undefined;
            }
        }

        if (
            this.timer &&
            !this.fnLostFocus &&
            !this.fnLostHover &&
            !this.fnLostActive
        ) {
            gTimerManager.detach(this.timer);
            this.timer = undefined;
        }
    }

    public close() {
        if (this.timer) {
            gTimerManager.detach(this.timer);
            this.timer = undefined;
        }
        this.refs = [];
        this.onTimer();
    }
}

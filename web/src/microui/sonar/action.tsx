import { TimerManager } from "../util";

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

export class ActionSonar {
    private refs: React.RefObject<Element>[];
    private fnLostHover?: () => void;
    private fnLostActive?: () => void;
    private fnLostFocus?: () => void;
    private timer?: number;

    constructor(refs: React.RefObject<Element>[]) {
        this.refs = refs;
    }

    public checkHover(onHover: () => void, onLostHover: () => void) {
        if (this.fnLostHover === undefined && this.hasAction("hover")) {
            onHover();
            this.fnLostHover = onLostHover;
            this.check();
        }
    }

    public checkFocus(onFocus: () => void, onLostFocus: () => void) {
        if (this.fnLostFocus === undefined && this.hasAction("focus")) {
            onFocus();
            this.fnLostFocus = onLostFocus;
            this.check();
        }
    }

    public checkActive(onActive: () => void, onLostActive: () => void) {
        if (this.fnLostActive === undefined && this.hasAction("active")) {
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
            this.timer = TimerManager.get().attach(this);
            TimerManager.get().fast(this.timer);
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
            TimerManager.get().detach(this.timer);
            this.timer = undefined;
        }
    }

    public close() {
        if (this.timer) {
            TimerManager.get().detach(this.timer);
            this.timer = undefined;
        }
        this.refs = [];
        this.onTimer();
    }
}

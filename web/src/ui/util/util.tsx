
export class HtmlChecker {
    ref: any
    fnLostFocus?: () => void
    fnLostHover?: () => void
    timer?: number;

    constructor(ref: any) {
        this.ref = ref
    }

    onLostFocus(fn: () => void) {
        if (!this.fnLostFocus) {
            this.fnLostFocus = fn
        }

        this.onCheck()
    }

    onLostHover(fn: () => void) {
        if (!this.fnLostHover) {
            this.fnLostHover = fn
        }

        this.onCheck()
    }

    private onCheck() {
        if (!this.timer) {
            if (!!this.fnLostFocus || !!this.fnLostHover) {
                this.timer = window.setInterval(() => {
                    this.onTimer()
                }, 60)
            }
        }
    }

    hasFocus(): boolean {
        const elem = this.ref.current
        if (elem) {
            return elem.matches(":focus")
        } else {
            return false
        }
    }

    hasHover(): boolean {
        const elem = this.ref.current
        if (elem) {
            return elem.matches(":hover")
        } else {
            return false
        }
    }

    private onTimer() {
        const elem = this.ref.current
        if (elem) {
            if (!!this.fnLostFocus) {
                if (!elem.matches(":focus")) {
                    this.fnLostFocus()
                    this.fnLostFocus = undefined
                }
            }

            if (!!this.fnLostHover) {
                if (!elem.matches(":hover")) {
                    this.fnLostHover()
                    this.fnLostHover = undefined
                }
            }

            if (!this.fnLostFocus && !this.fnLostHover) {
                window.clearInterval(this.timer)
                this.timer = undefined
            }
        }
    }
}

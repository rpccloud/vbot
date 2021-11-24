import { range } from "..";
import { makeTransition } from "..";
import { PointerManager } from "./pointer-manager";

export class ActionBackground {
    private hover: boolean;
    private active: boolean;
    private focus: boolean;

    private root: HTMLDivElement;
    private hoverElement?: HTMLDivElement;
    private activeElement?: HTMLDivElement;
    private focusElement?: HTMLDivElement;

    private hoverOpacity: number = 0;
    private activeOpacity: number = 0;
    private hasHoverScaleEffect: boolean = false;
    private hasActiveScaleEffect: boolean = false;

    constructor(root: HTMLDivElement) {
        this.root = root;
        this.hover = false;
        this.active = false;
        this.focus = false;
    }

    private prepareEffect(
        elem: HTMLDivElement,
        color: string,
        hasScaleEffect: boolean,
        fade: boolean
    ) {
        const rootRect = this.root.getBoundingClientRect();
        const mousePT = PointerManager.get().getMouseLocation();
        const pt = { x: mousePT.x - rootRect.x, y: mousePT.y - rootRect.y };
        const rw = this.root.clientWidth;
        const rh = this.root.clientHeight;
        const mouseX = range(pt.x, 0, rw);
        const mouseY = range(pt.y, 0, rw);

        const maxDeltaX = Math.max(mouseX, rw - mouseX);
        const maxDeltaY = Math.max(mouseY, rh - mouseY);
        const radius = Math.ceil(
            Math.sqrt(Math.pow(maxDeltaX, 2) + Math.pow(maxDeltaY, 2))
        );

        elem.style.left = `${mouseX - radius}px`;
        elem.style.top = `${mouseY - radius}px`;
        elem.style.width = `${2 * radius}px`;
        elem.style.height = `${2 * radius}px`;
        elem.style.borderRadius = `${radius}px`;

        if (!fade) {
            elem.style.background = `${color}`;
            elem.style.opacity = "0";
            elem.style.transform = hasScaleEffect ? "scale(0)" : "scale(1)";
        }
    }

    public setFocus(
        focus: boolean,
        color: string,
        lineStyle: string,
        lineWidth: number,
        inset: number,
        borderRadius: number
    ) {
        if (this.focus !== focus) {
            this.focus = focus;

            if (!this.focusElement) {
                this.focusElement = document.createElement("div");
                this.focusElement.style.position = "absolute";
                this.focusElement.style.inset = "0px";
                this.focusElement.style.opacity = "0";
                this.root.insertBefore(this.focusElement, this.root.firstChild);
            }

            if (focus) {
                this.focusElement.style.inset = `${inset}px`;
                this.focusElement.style.borderWidth = `${lineWidth}px`;
                this.focusElement.style.borderStyle = `${lineStyle}`;
                this.focusElement.style.borderColor = `${color}`;
                this.focusElement.style.borderRadius = `${borderRadius}px`;
                this.focusElement.style.opacity = "1";
            } else {
                this.focusElement.style.opacity = "0";
            }
        }
    }

    public setHover(
        hover: boolean,
        color: string,
        hoverOpacity: number,
        hasScaleEffect: boolean,
        transaction: { durationMS: number; easing: string }
    ) {
        if (this.hover !== hover) {
            this.hover = hover;
            this.hoverOpacity = hoverOpacity;
            this.hasHoverScaleEffect = hasScaleEffect;

            if (!this.hoverElement) {
                this.hoverElement = document.createElement("div");
                this.hoverElement.style.position = "absolute";
                this.hoverElement.style.inset = "0px";
                this.hoverElement.style.opacity = "0";
                this.hoverElement.style.transform = hasScaleEffect
                    ? "scale(0)"
                    : "scale(1)";
                this.root.insertBefore(this.hoverElement, null);
            }

            this.hoverElement.style.transition = makeTransition(
                ["opacity", "transform"],
                transaction.durationMS + "ms",
                transaction.easing
            );

            this.prepareEffect(
                this.hoverElement,
                color,
                hasScaleEffect,
                !hover
            );

            this.flush();
        }
    }

    public setActive(
        active: boolean,
        color: string,
        activeOpacity: number,
        hasScaleEffect: boolean,
        transaction: { durationMS: number; easing: string }
    ) {
        if (this.active !== active) {
            this.active = active;
            this.activeOpacity = activeOpacity;
            this.hasActiveScaleEffect = hasScaleEffect;

            if (!this.activeElement) {
                this.activeElement = document.createElement("div");
                this.activeElement.style.position = "absolute";
                this.activeElement.style.inset = "0px";
                this.activeElement.style.opacity = "0";
                this.activeElement.style.transform = hasScaleEffect
                    ? "scale(0)"
                    : "scale(1)";
                this.root.insertBefore(this.activeElement, null);
            }

            this.activeElement.style.transition = makeTransition(
                ["opacity", "transform"],
                transaction.durationMS + "ms",
                transaction.easing
            );

            this.prepareEffect(
                this.activeElement,
                color,
                hasScaleEffect,
                !active
            );

            this.flush();
        }
    }

    private flush() {
        if (this.hoverElement) {
            if (this.hover) {
                this.hoverElement.style.transform = "scale(1)";
                this.hoverElement.style.opacity = `${this.hoverOpacity}`;
            } else {
                if (this.hasHoverScaleEffect) {
                    this.hoverElement.style.transform = "scale(0)";
                }
                this.hoverElement.style.opacity = "0";
            }
        }

        if (this.activeElement) {
            if (this.active) {
                this.activeElement.style.transform = "scale(1)";
                this.activeElement.style.opacity = `${this.activeOpacity}`;
            } else {
                if (this.hasActiveScaleEffect) {
                    this.activeElement.style.transform = "scale(0)";
                }
                this.activeElement.style.opacity = "0";
            }
        }
    }
}

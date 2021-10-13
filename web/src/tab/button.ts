import { IButtonConfig } from "./defs";

export abstract class RoundButton {
  private isInit: boolean;
  protected config?: IButtonConfig;
  private className: string;
  protected isActive: boolean;
  private isDisplay: boolean;
  private isMouseOver: boolean;
  private isMouseDown: boolean;
  private onClick?: () => void;
  protected rootElem: HTMLDivElement;
  protected canvasElem: HTMLCanvasElement;

  private bindPointerDown?: (e: PointerEvent) => void;
  private bindPointerUp?: (e: PointerEvent) => void;
  private bindPointerOut?: (e: PointerEvent) => void;
  private bindPointerOver?: (e: PointerEvent) => void;

  protected abstract drawForeground(ctx: CanvasRenderingContext2D): boolean;

  public constructor(className: string, onClick?: () => void) {
    this.isInit = true;

    this.className = className;
    this.isActive = true;
    this.isDisplay = true;
    this.isMouseDown = false;
    this.isMouseOver = false;
    this.onClick = onClick;

    this.bindPointerDown = this.onPointerDown.bind(this);
    this.bindPointerUp = this.onPointerUp.bind(this);
    this.bindPointerOut = this.onPointerOut.bind(this);
    this.bindPointerOver = this.onPointerOver.bind(this);

    this.rootElem = document.createElement("div");
    this.rootElem.className = className;

    this.canvasElem = document.createElement("canvas");
    this.canvasElem.className = `${className}-canvas`;
    this.rootElem.appendChild(this.canvasElem);

    this.rootElem.addEventListener("pointerdown", this.bindPointerDown);
    this.rootElem.addEventListener("pointerup", this.bindPointerUp);
    this.rootElem.addEventListener("pointerout", this.bindPointerOut);
    this.rootElem.addEventListener("pointerover", this.bindPointerOver);
  }

  public getRootElem(): HTMLDivElement {
    return this.rootElem;
  }

  public setActive(isActive: boolean): void {
    if (this.isActive !== isActive) {
      this.isActive = isActive;
      this.updateClassName();
      if (this.config) {
        this.flushConfig(this.config);
      }
    }
  }

  public setDisplay(isDisplay: boolean): void {
    if (this.isDisplay !== isDisplay) {
      this.isDisplay = isDisplay;
      this.rootElem.style.display = isDisplay ? "block" : "none";
    }
  }

  public destroy(): boolean {
    if (this.isInit) {
      this.isInit = false;
      this.onClick = undefined;
      this.rootElem.parentNode?.removeChild(this.rootElem);

      if (this.bindPointerDown) {
        this.rootElem.removeEventListener("pointerdown", this.bindPointerDown);
        this.bindPointerDown = undefined;
      }

      if (this.bindPointerUp) {
        this.rootElem.removeEventListener("pointerup", this.bindPointerUp);
        this.bindPointerUp = undefined;
      }

      if (this.bindPointerOver) {
        this.rootElem.removeEventListener("pointerover", this.bindPointerOver);
        this.bindPointerOver = undefined;
      }

      if (this.bindPointerOut) {
        this.rootElem.removeEventListener("pointerout", this.bindPointerOut);
        this.bindPointerOut = undefined;
      }

      return true;
    } else {
      return false;
    }
  }

  private updateClassName(): void {
    const className = this.className;
    if (this.isActive && this.isMouseOver && this.isMouseDown) {
      this.rootElem.className = `${className} ${className}_mousedown`;
    } else if (this.isActive && this.isMouseOver) {
      this.rootElem.className = `${className} ${className}_mouseover`;
    } else {
      this.rootElem.className = className;
    }
  }

  private onPointerOver(e: PointerEvent): void {
    e.stopPropagation();
    e.preventDefault();

    this.isMouseOver = true;
    this.updateClassName();
  }

  private onPointerOut(e: PointerEvent): void {
    e.stopPropagation();
    e.preventDefault();

    this.isMouseOver = false;
    this.updateClassName();
  }

  private onPointerDown(e: PointerEvent): void {
    e.stopPropagation();
    e.preventDefault();

    if (!this.isMouseDown) {
      this.isMouseDown = true;
      this.rootElem.setPointerCapture(e.pointerId);
    }

    this.updateClassName();
  }

  private onPointerUp(e: PointerEvent): void {
    e.stopPropagation();
    e.preventDefault();

    if (this.isMouseDown) {
      this.isMouseDown = false;
      this.rootElem.releasePointerCapture(e.pointerId);
      let elem = document.elementFromPoint(e.clientX, e.clientY);
      if (
        (elem === this.rootElem || elem === this.canvasElem) &&
        this.onClick &&
        this.isActive
      ) {
        this.onClick();
      }
    }

    this.updateClassName();
  }

  protected flushConfig(config: IButtonConfig): void {
    this.config = config;
    const width = config.size.width;
    const height = config.size.height;
    const ctx = this.canvasElem.getContext("2d");
    const dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;
    this.canvasElem.width = width * dpr;
    this.canvasElem.height = height * dpr;
    this.canvasElem.style.width = `${width}px`;
    this.canvasElem.style.height = `${height}px`;
    if (ctx) {
      ctx.scale(dpr, dpr);
      this.drawForeground(ctx);
    }
  }
}

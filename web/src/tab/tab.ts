import {
  AppPageData,
  AppPageKind,
  ITabConfig,
} from "./defs";
import { RoundButton } from "./button";
import { TabConfig } from "./config";
import { TabBar } from "./tab-bar";

class Title {
  private x: number;
  private width: number;
  private isFocus: boolean;
  private isDisplay: boolean;
  private rootElem: HTMLDivElement;
  private spanElem: HTMLSpanElement;

  public constructor() {
    this.x = 0;
    this.width = 0;
    this.isFocus = false;
    this.isDisplay = true;
    this.rootElem = document.createElement("div");
    this.rootElem.className = "tab-title";
    this.spanElem = document.createElement("span");
    this.spanElem.className = "tab-title-content";
    this.rootElem.appendChild(this.spanElem);
  }

  public getRootElem(): HTMLDivElement {
    return this.rootElem;
  }

  public setFocus(isFocus: boolean): void {
    if (this.isFocus !== isFocus) {
      this.isFocus = isFocus;
      this.rootElem.className = isFocus ?
        "tab-title tab-title_focus" :
        "tab-title";
    }
  }

  public setDisplay(isDisplay: boolean): void {
    if (this.isDisplay !== isDisplay) {
      this.isDisplay = isDisplay;
      this.rootElem.style.display = isDisplay ? "block" : "none";
    }
  }

  public setXAndWidth(x: number, width: number): void {
    if (this.x !== x || this.width !== width) {
      this.x = x;
      this.width = width;
      this.rootElem.style.left = `${x + width - 300}px`;
      this.spanElem.style.marginLeft = `${300 - width}px`;
    }
  }

  public setTitle(title: string): void {
    this.spanElem.textContent = title;
    if (this.isDisplay) {
      this.rootElem.style.display = "none";
      setTimeout(() => {
        this.rootElem.style.display = this.isDisplay ? "block" : "none";
      }, 50);
    }
  }
}

class CloseButton extends RoundButton {
  private x: number;

  public constructor(onClick: () => void) {
    super("tab-closeButton", onClick);
    this.flushConfig();
    this.x = 0;
  }

  public setX(x: number): void {
    if (this.x !== x) {
      this.x = x;
      this.rootElem.style.left = `${x}px`;
    }
  }

  protected drawForeground(ctx: CanvasRenderingContext2D): boolean {
    const config = this.config;
    if (config) {
      const w = config.size.width;
      const h = config.size.height;
      const fgSize = config.fgSize;

      ctx.beginPath();
      ctx.moveTo((w - fgSize) / 2, (h - fgSize) / 2);
      ctx.lineTo((w + fgSize) / 2, (h + fgSize) / 2);
      ctx.moveTo((w + fgSize) / 2, (h - fgSize) / 2);
      ctx.lineTo((w - fgSize) / 2, (h + fgSize) / 2);
      ctx.strokeStyle = this.isActive ? config.fgColor : config.fgColorInactive;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.stroke();
      return true;
    } else {
      return false;
    }
  }

  public flushConfig(): void {
    super.flushConfig(TabConfig.get().tab.closeButton);
  }
}

export class Tab {
  private isInit: boolean;
  private display: boolean;
  private isAnimate: boolean;
  private zIndex: number;
  public readonly data: AppPageData;
  public index: number;
  private x: number;
  private width: number;
  public path: Path2D;
  public hideSpacer: boolean;

  public isFocus: boolean;
  public isMouseOver: boolean;
  public isMoving: boolean;
  private focusTimeMS: number;

  private config: ITabConfig;
  private ctx?: CanvasRenderingContext2D;
  private rootElem: HTMLDivElement;
  private bgElem: HTMLCanvasElement;

  private title: Title;
  private closeButton: CloseButton;
   //private pageBarContent: PageBarContent;

  public constructor(tabBar: TabBar, data: AppPageData) {
    this.isInit = true;
    this.display = true;
    this.isAnimate = false;
    this.zIndex = 0;
    this.data = data;
    this.index = -1;
    this.x = 0;
    this.width = 0;
    this.path = new Path2D();
    this.hideSpacer = false;
    this.isFocus = false;
    this.isMouseOver = false;
    this.isMoving = false;
    this.focusTimeMS = 0;
    this.config = TabConfig.get().tab;
    this.rootElem = document.createElement("div");
    this.rootElem.className = "tab";
    this.bgElem = document.createElement("canvas");
    this.bgElem.className = "tab-bg";
    this.title = new Title();
    this.closeButton = new CloseButton(() => {
      tabBar.deleteTab(this.data.id);
    });

    this.rootElem.appendChild(this.bgElem);
    this.rootElem.appendChild(this.title.getRootElem());
    this.rootElem.appendChild(this.closeButton.getRootElem());
  }

  public destory(): boolean {
    if (this.isInit) {
      this.isInit = false;
      this.closeButton.destory();
      this.rootElem.parentNode?.removeChild(this.rootElem);
      return true;
    } else {
      return false;
    }
  }

  public getFocusTimeMS(): number {
    return this.focusTimeMS;
  }

  public getRootElem(): HTMLDivElement {
    return this.rootElem;
  }

  public setFocus(isFocus: boolean): void {
    if (this.isFocus !== isFocus) {
      if (isFocus) {
        this.focusTimeMS = new Date().getTime();
        // Browser.Get().getPageBar().setContent(this.pageBarContent);
      }
      this.isFocus = isFocus;
      this.updateBGClassName();
    }
  }

  public setMouseOver(isMouseOver: boolean): void {
    if (this.isMouseOver !== isMouseOver) {
      this.isMouseOver = isMouseOver;
      this.updateBGClassName();
    }
  }

  public setX(x: number): void {
    if (this.x !== x) {
      this.x = x;
      this.rootElem.style.left = `${x}px`;
    }
  }

  public getX(): number {
    return this.x;
  }

  public setWidth(width: number): void {
    if (this.width !== width) {
      this.width = width;
      this.rootElem.style.width = `${width}px`;
    }
  }

  public getWeight(): number {
    let ret = this.index;

    switch (this.data.kind) {
      case AppPageKind.Home:
        ret += 42949672960;
        break;
      default:
        break;
    }

    if (this.isMouseOver) {
      ret += 429496729600;
    }

    if (this.isFocus) {
      ret += 4294967296000;
    }

    return ret;
  }

  public setDisplay(display: boolean): void {
    if (this.display !== display) {
      this.display = display;
      this.rootElem.style.display = display ? "block" : "none";
    }
  }

  public isDisplay(): boolean {
    return this.display;
  }


  public setAnimate(isAnimate: boolean): void {
    if (this.isAnimate !== isAnimate) {
      this.isAnimate = isAnimate;
      this.rootElem.className = isAnimate ? "tab tab_animate" : "tab";
    }
  }

  private setZIndex(zIndex: number): void {
    if (this.zIndex !== zIndex) {
      this.zIndex = zIndex;
      this.rootElem.style.zIndex = `${zIndex}`;
    }
  }

  public flush(): void {
    if (this.isMouseOver || this.isFocus) {
      this.drawPath();
    }

    const r = this.config.radius;
    const m = this.config.inMargin;
    let leftX = r + this.config.leftMargin;
    let rightX = this.width - r - this.config.rightMargin;

    // flush close button
    const showClose = (this.data.kind !== AppPageKind.Home) &&
      (this.isFocus || this.width > this.config.disappearCloseWidth);
    if (showClose) {
      rightX -= this.config.closeButton.size.width;
      this.closeButton.setX(rightX);
      this.closeButton.setDisplay(true);
      rightX -= m;
    } else {
      this.closeButton.setDisplay(false);
    }

    // flush title
    const titleWidth = rightX - leftX;
    this.title.setFocus(this.isFocus);
    if (titleWidth > 0) {
      this.title.setXAndWidth(leftX, rightX - leftX);
      this.title.setDisplay(true);
    } else {
      this.title.setDisplay(false);
    }

    // flush root
    this.setZIndex(this.getWeight());
  }

  public flushConfig(): void {
    // Get the device pixel ratio, falling back to 1.
    this.config = TabConfig.get().tab;
    const ctx = this.bgElem.getContext("2d");
    const dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;
    this.bgElem.width = this.config.maxMovedWidth * dpr;
    this.bgElem.height = this.config.height * dpr;
    this.bgElem.style.width = `${this.config.maxMovedWidth}px`;
    this.bgElem.style.height = `${this.config.height}px`;
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    if (ctx) {
      ctx.scale(dpr, dpr);
      this.ctx = ctx;
    } else {
      this.ctx = undefined;
    }
  }

  public flushPageData(data: AppPageData): void {
    if (this.data.id === data.id && this.data.seq < data.seq) {
      this.data.seq = data.seq;

      if (this.data.title !== data.title) {
        this.data.title = data.title;
        this.title.setTitle(data.title);
      }
    }
  }

  private drawPath(): void {
    if (!this.ctx) {
      this.flushConfig();
    }
    const ctx = this.ctx;
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = this.config.bgColor;
      ctx.fill(this.path);
    }
  }

  private updateBGClassName(): void {
    if (this.isFocus) {
      this.bgElem.className = "tab-bg tab-bg_focus";
    } else if (this.isMouseOver) {
      this.bgElem.className = "tab-bg tab-bg_mouseover";
    } else {
      this.bgElem.className = "tab-bg";
    }
  }
}

import {
  AppPageData,
  AppPageKind,
  ITabConfig,
  AppPageState,
  IFaviconConfig,
} from "./defs";
import { ConfigRenderer } from "./config-renderer";
import { RoundButton } from "./button";
import { PageBarContent } from "./page";
import { Browser } from "./main";


class Favicon {
  private static LoadingStart(range: number): number {
    if (range === 0) {
      return 0;
    } else if (range < 0.4) {
      return range / 4;
    } else if (range < 0.9) {
      return (range - 0.4) * 1.8 + 0.1;
    } else {
      return 0.99;
    }
  }

  private static LoadingEnd(range: number): number {
    if (range === 0) {
      return 0;
    } else if (range < 0.4) {
      return range * 9 / 4;
    } else if (range < 0.9) {
      return (range - 0.4) / 5 + 0.9;
    } else {
      return 1;
    }
  }

  private rootElem: HTMLDivElement;
  protected canvasElem: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  private isDisplay: boolean;

  private baseAngle: number;
  private tickLoading: number;
  private tickLeaving: number;
  private isFaviconLoaded: boolean;
  private state: AppPageState;
  private timerHandler?: number;

  private image: HTMLImageElement;

  public constructor() {
    this.rootElem = document.createElement("div");
    this.rootElem.className = "tab-favicon";
    this.image = new Image();
    this.canvasElem = document.createElement("canvas");
    this.rootElem.appendChild(this.canvasElem);

    const ctx = this.canvasElem.getContext("2d");
    if (ctx) {
      this.ctx = ctx;
    }

    this.image.addEventListener("load", () => {
      this.isFaviconLoaded = true;
      this.startTimer();
    });

    this.isDisplay = true;
    this.baseAngle = 270;
    this.tickLoading = 0;
    this.tickLeaving = 0;
    this.isFaviconLoaded = false;
    this.state = AppPageState.Closed;

    this.flushConfig(ConfigRenderer.getConfig().tabBar.tab.favicon);
  }

  public getRootElem(): HTMLDivElement {
    return this.rootElem;
  }

  public setDisplay(isDisplay: boolean): void {
    if (this.isDisplay !== isDisplay) {
      this.isDisplay = isDisplay;
      this.rootElem.style.display = isDisplay ? "block" : "none";
    }
  }

  public setLoading(): void {
    // calculate the base angle
    if (this.state === AppPageState.Leaving) {
      this.baseAngle = this.baseAngle - this.tickLeaving;
    }
    this.tickLoading = 0;
    this.state = AppPageState.Loading;
    this.startTimer();
  }

  public setLoaded(): void {
    this.baseAngle = 270;
    this.tickLoading = 0;
    this.tickLeaving = 0;
    this.state = AppPageState.Loaded;
    this.startTimer();
  }

  public setLeaving(): void {
    // calculate the base angle
    if (this.state === AppPageState.Loading) {
      this.baseAngle = this.baseAngle + this.tickLoading / 3 +
        Favicon.LoadingStart((this.tickLoading % 360) / 360) * 360;
    }

    this.tickLeaving = 0;
    this.state = AppPageState.Leaving;
    this.startTimer();
  }

  public setFavicon(favicon: string): void {
    this.isFaviconLoaded = false;
    if (favicon !== "") {
      this.image.src = favicon;
    }

    this.startTimer();
  }

  private startTimer(): void {
    if (this.timerHandler === undefined) {
      this.timerHandler = setInterval(() => {
        console.log("onTimer");
        if (this.state === AppPageState.Loading) {
          this.flush();
        } else if (this.state === AppPageState.Leaving) {
          this.flush();
        } else {
          this.stopTimer();
          this.flush();
        }
      }, 40) as any;
    }
  }

  private stopTimer(): void {
    if (this.timerHandler !== undefined) {
      clearInterval(this.timerHandler);
      this.timerHandler = undefined;
    }
  }

  private flushConfig(config: IFaviconConfig): void {
    const favSize = config.size;
    const width = favSize.width;
    const height = favSize.height;

    const dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;
    this.canvasElem.width = width * dpr;
    this.canvasElem.height = height * dpr;
    this.canvasElem.style.width = `${width}px`;
    this.canvasElem.style.height = `${height}px`;
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
      this.startTimer();
    }
  }

  private flush(): void {
    const config = ConfigRenderer.getConfig().tabBar.tab.favicon;
    const cx = config.size.width / 2;
    const cy = config.size.height / 2;
    const r = Math.max(Math.min(cx, cy) - 1, 1);

    switch (this.state) {
      case AppPageState.Loading: {
        this.tickLoading += 3;
        if (this.tickLoading > 1080) {
          this.tickLoading -= 1080;
        }
        const startAngle = this.baseAngle + this.tickLoading / 3 +
          Favicon.LoadingStart((this.tickLoading % 360) / 360) * 360;
        const endAngle = this.baseAngle + this.tickLoading / 3 +
          Favicon.LoadingEnd((this.tickLoading % 360) / 360) * 360;

        const ctx = this.ctx;
        if (ctx) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          if (this.isFaviconLoaded) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, r - 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.globalAlpha = 0.4;
            ctx.drawImage(
              this.image,
              2,
              2,
              config.size.width - 4,
              config.size.height - 4,
            );
            ctx.restore();
          }

          ctx.beginPath();
          ctx.arc(cx, cy, r, startAngle * Math.PI / 180, endAngle * Math.PI / 180);
          ctx.strokeStyle = config.loadingColor;
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.globalAlpha = 1;
          ctx.stroke();
        }
        break;
      }
      case AppPageState.Leaving: {
        this.tickLeaving += 4;
        if (this.tickLeaving > 720) {
          this.tickLeaving -= 360;
        }

        const endAngle = this.baseAngle - this.tickLeaving;
        const startAngle = endAngle - Math.min(this.tickLeaving, 180);
        const ctx = this.ctx;
        if (ctx) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

          if (this.isFaviconLoaded) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, r - 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.globalAlpha = 0.4;
            ctx.drawImage(
              this.image,
              2,
              2,
              config.size.width - 4,
              config.size.height - 4,
            );
            ctx.restore();
          }

          ctx.beginPath();
          ctx.arc(cx, cy, r, startAngle * Math.PI / 180, endAngle * Math.PI / 180);
          ctx.strokeStyle = config.leavingColor;
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.globalAlpha = 1;
          ctx.stroke();
        }
        break;
      }
      case AppPageState.Loaded: {
        const ctx = this.ctx;
        if (ctx) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

          if (this.isFaviconLoaded) {
            ctx.globalAlpha = 1;
            ctx.drawImage(this.image, 1, 1, config.size.width - 2, config.size.height - 2);
          }
        }
        break;
      }
      default:
        break;
    }
  }
}

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
    super.flushConfig(ConfigRenderer.getConfig().tabBar.tab.closeButton);
  }
}

class Spacer {
  private rootElem: HTMLDivElement;
  private isDisplay: boolean;

  public constructor() {
    this.rootElem = document.createElement("div");
    this.rootElem.className = "tab-spacer";
    this.isDisplay = true;
  }

  public getRootElem(): HTMLDivElement {
    return this.rootElem;
  }

  public setDisplay(isDisplay: boolean): void {
    if (this.isDisplay !== isDisplay) {
      this.isDisplay = isDisplay;
      this.rootElem.style.display = isDisplay ? "block" : "none";
    }
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

  private favicon: Favicon;
  private title: Title;
  private closeButton: CloseButton;
  private spacer: Spacer;
  private pageBarContent: PageBarContent;

  public constructor(data: AppPageData) {
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
    this.config = ConfigRenderer.getConfig().tabBar.tab;
    this.rootElem = document.createElement("div");
    this.rootElem.className = "tab";
    this.bgElem = document.createElement("canvas");
    this.bgElem.className = "tab-bg";
    this.favicon = new Favicon();
    this.title = new Title();
    this.closeButton = new CloseButton(() => {
      Browser.Get().getTabBar().deleteTab(this.data.id);
    });
    this.spacer = new Spacer();

    this.rootElem.appendChild(this.bgElem);
    this.rootElem.appendChild(this.favicon.getRootElem());
    this.rootElem.appendChild(this.title.getRootElem());
    this.rootElem.appendChild(this.closeButton.getRootElem());
    this.rootElem.appendChild(this.spacer.getRootElem());

    this.pageBarContent = new PageBarContent(data.id, data.canGoForward, data.canGoForward);
    this.pageBarContent.setAddress(data.url);
  }

  public destory(): boolean {
    if (this.isInit) {
      this.isInit = false;
      this.closeButton.destory();
      this.pageBarContent.destory();
      this.rootElem.parentNode?.removeChild(this.rootElem);
      return true;
    } else {
      return false;
    }
  }

  public fixedShowHideFocusBug(): void {
    this.pageBarContent.fixedShowHideFocusBug();
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
        Browser.Get().getPageBar().setContent(this.pageBarContent);
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
      case AppPageKind.Fixed:
        ret += 4294967296;
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
    const favWidth = this.config.favicon.size.width;
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

    // flush favicon
    const showFavicon = (!this.isFocus) || (favWidth + m < rightX - leftX);
    if (showFavicon) {
      this.favicon.setDisplay(true);
      leftX += favWidth + m;
    } else {
      this.favicon.setDisplay(false);
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

    // flush spacer
    this.spacer.setDisplay(!this.hideSpacer);

    // flush root
    this.setZIndex(this.getWeight());
  }

  public flushConfig(): void {
    // Get the device pixel ratio, falling back to 1.
    this.config = ConfigRenderer.getConfig().tabBar.tab;
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

      if (this.data.state !== data.state) {
        switch (data.state) {
          case AppPageState.Loading:
            this.favicon.setLoading();
            break;
          case AppPageState.Leaving:
            this.favicon.setLeaving();
            break;
          case AppPageState.Loaded:
            this.favicon.setLoaded();
            break;
          default:
            break;
        }
        this.data.state = data.state;
        this.pageBarContent.setState(data.state);
      }

      if (this.data.url !== data.url) {
        this.data.url = data.url;
        this.pageBarContent.setAddress(data.url);
      }

      if (this.data.canGoBack !== data.canGoBack) {
        this.data.canGoBack = data.canGoBack;
        this.pageBarContent.setCanGoBack(data.canGoBack);
      }

      if (this.data.canGoForward !== data.canGoForward) {
        this.data.canGoForward = data.canGoForward;
        this.pageBarContent.setCanGoForward(data.canGoForward);
      }

      if (this.data.favicon !== data.favicon) {
        this.data.favicon = data.favicon;
        this.favicon.setFavicon(data.favicon);
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

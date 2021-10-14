import tabConfig, {
    IButtonConfig,
} from "./defs";
import { RoundButton } from "./button";
import { TabBar } from "./tab-bar";
import { ThemeConfig } from "../ui/theme/config";

class Title {
  private x: number;
  private width: number;
  private isFocus: boolean;
  private isDisplay: boolean;
  private rootElem: HTMLDivElement;
  private spanElem: HTMLSpanElement;

  public constructor(text: string) {
    this.x = 0;
    this.width = 0;
    this.isFocus = false;
    this.isDisplay = true;
    this.rootElem = document.createElement("div");
    this.rootElem.style.webkitBackgroundClip = "text"
    this.rootElem.style.whiteSpace = "nowrap"
    this.rootElem.style.color = "transparent"
    this.rootElem.style.userSelect = "none"
    this.rootElem.style.pointerEvents = "none"
    this.rootElem.style.top = `${(tabConfig.tabHeight - tabConfig.titleHeight)/2}px`
    this.rootElem.style.width = "300px"
    this.rootElem.style.position = "absolute"
    this.rootElem.style.lineHeight = `${tabConfig.titleHeight}px`
    this.spanElem = document.createElement("span");
    this.spanElem.style.float = "left"
    this.spanElem.textContent = text;
    this.rootElem.appendChild(this.spanElem);
  }

  public getRootElem(): HTMLDivElement {
    return this.rootElem;
  }

  public setFocus(isFocus: boolean): void {
    if (this.isFocus !== isFocus) {
        this.isFocus = isFocus;
        this.flushTheme()
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

  public flushTheme(): void {
      const theme = ThemeConfig.get()
    this.spanElem.style.fontSize = `${theme.fontSizeMedium}px`
    const color = this.isFocus ? theme.primaryColor : theme.fontColor
    this.rootElem.style.backgroundImage =
        `linear-gradient(to right, ${color} 0%, ${color} 93%, rgba(0, 0, 0, 0)  100%)`
  }
}

class CloseButton extends RoundButton {
  private x: number;

  public constructor(onClick: () => void) {
    super(CloseButton.getButtonConfig(), onClick);
    this.rootElem.style.top = `${(tabConfig.tabHeight - tabConfig.closeBtnHeight)/ 2}px`;
    this.flushTheme();
    this.x = 0;
  }

  public static getButtonConfig(): IButtonConfig {
    const theme = ThemeConfig.get()

    return   {
        size: {width: tabConfig.closeBtnWidth, height: tabConfig.closeBtnHeight},
        bgColorPress: theme.primaryColor,
        bgColorMouseOver: theme.backgroundColorDarken,
        bgColorMouseOut: "transparent",
    }
  }

  public setX(x: number): void {
    if (this.x !== x) {
      this.x = x;
      this.rootElem.style.left = `${x}px`;
    }
  }

  protected drawForeground(ctx: CanvasRenderingContext2D): boolean {
    const theme = ThemeConfig.get()
    const w = tabConfig.closeBtnWidth;
    const h = tabConfig.closeBtnHeight;
    const fgSize = tabConfig.closeBtnSize;

    ctx.beginPath();
    ctx.moveTo((w - fgSize) / 2, (h - fgSize) / 2);
    ctx.lineTo((w + fgSize) / 2, (h + fgSize) / 2);
    ctx.moveTo((w + fgSize) / 2, (h - fgSize) / 2);
    ctx.lineTo((w - fgSize) / 2, (h + fgSize) / 2);
    ctx.strokeStyle = theme.fontColor;
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.stroke();
    return true;
  }

  public flushTheme(): void {
    super.flushConfig(CloseButton.getButtonConfig());
  }
}

export class Tab {
    public id: number;
    public isHome: boolean;
  private param: string;

  private display: boolean;
  private isAnimate: boolean;
  private zIndex: number;

  public index: number;
  private x: number;
  private width: number;
  public path: Path2D;

  public isFocus: boolean;
  public isMouseOver: boolean;
  public isMoving: boolean;
  private focusTimeMS: number;

  private ctx?: CanvasRenderingContext2D;
  private rootElem: HTMLDivElement;
  private bgElem: HTMLCanvasElement;

  private title: Title;
  private closeButton: CloseButton;
   //private pageBarContent: PageBarContent;

  public constructor(tabBar: TabBar,isHome: boolean, id: number, param: string) {
      this.id = id;
    this.isHome = isHome;
    this.param = param
    this.display = true;
    this.isAnimate = false;
    this.zIndex = 0;
    this.index = -1;
    this.x = 0;
    this.width = 0;
    this.path = new Path2D();
    this.isFocus = false;
    this.isMouseOver = false;
    this.isMoving = false;
    this.focusTimeMS = 0;
    this.rootElem = document.createElement("div");
    this.rootElem.style.position = "absolute";
    this.rootElem.style.top = `${tabConfig.tabBarHeight - tabConfig.tabHeight}px`;
    this.rootElem.style.height = `${tabConfig.tabHeight}px`;
    this.rootElem.style.overflow = "hidden";

    this.bgElem = document.createElement("canvas");
    this.title = new Title("Test-title-absdfsafdas-sdfasldfj-sdfasdf");
    this.closeButton = new CloseButton(() => {
      tabBar.deleteTab(id);
    });

    this.rootElem.appendChild(this.bgElem);
    this.rootElem.appendChild(this.title.getRootElem());
    this.rootElem.appendChild(this.closeButton.getRootElem());
  }

  public destroy(): boolean {
    this.closeButton.destroy();
    this.rootElem.parentNode?.removeChild(this.rootElem);
    return true;
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
      this.flushTheme();
    }
  }

  public setMouseOver(isMouseOver: boolean): void {
    if (this.isMouseOver !== isMouseOver) {
      this.isMouseOver = isMouseOver;
      this.flushTheme();
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

    if (this.isHome) {
        ret += 42949672960;
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

      if (isAnimate) {
        this.rootElem.style.transition = "left 0.20s ease-out";
      } else {
        this.rootElem.style.transition = "";
      }
    }
  }

  private setZIndex(zIndex: number): void {
    if (this.zIndex !== zIndex) {
      this.zIndex = zIndex;
      this.rootElem.style.zIndex = `${zIndex}`;
    }
  }

  public flush(): void {
    this.drawPath();

    const r = tabConfig.tabRadius;
    const m = tabConfig.tabInMargin;
    let leftX = r + tabConfig.tabLeft;
    let rightX = this.width - r - tabConfig.tabRight;

    // flush close button
    const showClose = !this.isHome &&
      (this.isFocus || this.width > tabConfig.tabDisappearCloseWidth);
    if (showClose) {
      rightX -= tabConfig.closeBtnWidth;
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

  public flushTheme(): void {
    // Get the device pixel ratio, falling back to 1.
    const ctx = this.bgElem.getContext("2d");
    const dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;
    this.bgElem.width = tabConfig.tabMaxWidth * dpr;
    this.bgElem.height = tabConfig.tabHeight * dpr;
    this.bgElem.style.width = `${tabConfig.tabMaxWidth}px`;
    this.bgElem.style.height = `${tabConfig.tabHeight}px`;
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    if (ctx) {
      ctx.scale(dpr, dpr);
      this.ctx = ctx;
    } else {
      this.ctx = undefined;
    }

    this.title.flushTheme()
    this.closeButton.flushTheme()
  }

  private drawPath(): void {
    const theme = ThemeConfig.get()
    if (!this.ctx) {
      this.flushTheme();
    }
    const ctx = this.ctx;
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = theme.backgroundColor;
      ctx.fill(this.path);
      ctx.lineWidth = 1;
        ctx.strokeStyle = (this.isFocus || this.isMouseOver)? theme.primaryColor : theme.fontColor;
        ctx.stroke(this.path);
    }
  }
}

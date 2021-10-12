import { RoundButton } from "./button";
import { ConfigRenderer } from "./config-renderer";
import { range, makeTabPath } from "./utils";
import { IPoint, AppPageKind, AppPageData } from "./defs";
import { Tab } from "./tab";
import { Browser } from "./main";

class AddButton extends RoundButton {
  private x: number;
  private isAnimate: boolean;

  public constructor(onClick: () => void) {
    super("tabBar-addButton", onClick);
    this.flushConfig();
    this.x = 0;
    this.isAnimate = false;
  }

  public setX(x: number): void {
    if (this.x !== x) {
      this.x = x;
      this.rootElem.style.left = `${x}px`;
    }
  }

  public setAnimate(isAnimate: boolean): void {
    if (this.isAnimate !== isAnimate) {
      this.isAnimate = isAnimate;
      this.rootElem.className = isAnimate ?
        "tabBar-addButton tabBar-addButton_animate" :
        "tabBar-addButton";
    }
  }

  protected drawForeground(ctx: CanvasRenderingContext2D): boolean {
    const config = this.config;
    if (config) {
      const w = config.size.width;
      const h = config.size.height;
      const fgSize = config.fgSize;

      ctx.beginPath();
      ctx.moveTo((w - fgSize) / 2, h / 2);
      ctx.lineTo((w + fgSize) / 2, h / 2);
      ctx.moveTo(w / 2, (h - fgSize) / 2);
      ctx.lineTo(w / 2, (h + fgSize) / 2);
      ctx.strokeStyle = this.isActive ? config.fgColor : config.fgColorInactive;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
      return true;
    } else {
      return false;
    }
  }

  public flushConfig(): void {
    super.flushConfig(ConfigRenderer.getConfig().tabBar.addButton);
  }
}

export class TabBar {
  private isInit: boolean;
  private ctx?: CanvasRenderingContext2D;
  private rootElem: HTMLDivElement;
  private addButton: AddButton;
  private checkMouseOutHandler?: number;

  private movingTab?: Tab;
  private mouseOverTab?: Tab;
  private focusTab?: Tab;
  private mouseDownPoint?: IPoint;

  private home?: Tab;
  private fixed: Array<Tab>;
  private moved: Array<Tab>;

  private tabY: number;
  private showFixed: number;
  private showMoved: number;
  private netFixedWidth: number;
  private netMovedWidth: number;
  private homePath: Path2D;
  private fixedPath: Path2D;

  private homeMin: number;
  private homeMax: number;
  private fixedMin: number;
  private fixedMax: number;
  private movedMin: number;
  private movedMax: number;

  public constructor() {
    const ctx = document.createElement("canvas").getContext("2d");

    this.isInit = true;
    this.ctx = ctx ? ctx : undefined;
    this.addButton = new AddButton(() => {
      this.addTab(AppPageKind.Moved, "http://bing.com", true, true);
    });
    this.rootElem = document.createElement("div");
    this.rootElem.className = "tabBar";
    this.rootElem.appendChild(this.addButton.getRootElem());

    this.checkMouseOutHandler = undefined;
    this.movingTab = undefined;
    this.mouseOverTab = undefined;
    this.focusTab = undefined;
    this.mouseDownPoint = undefined;

    this.home = undefined;
    this.fixed = [];
    this.moved = [];

    this.tabY = 0;
    this.showFixed = 0;
    this.showMoved = 0;
    this.netFixedWidth = 0;
    this.netMovedWidth = 0;
    this.homePath = new Path2D();
    this.fixedPath = new Path2D();

    this.homeMin = 0;
    this.homeMax = 0;
    this.fixedMin = 0;
    this.fixedMax = 0;
    this.movedMin = 0;
    this.movedMax = 0;

    this.rootElem.addEventListener("pointerdown", e => {
      this.onPointerDown(e);
    });
    this.rootElem.addEventListener("pointerup", e => {
      this.onPointerUp(e);
    });
    this.rootElem.addEventListener("pointermove", e => {
      this.onPointerMove(e);
    });

    this.flushConfig();

    // create home page
    window.requestAnimationFrame(() => {
      this.addTab(AppPageKind.Home, "kztool://home", true, true);
    });
  }

  public fixedShowHideFocusBug(): void {
    this.focusTab?.fixedShowHideFocusBug();
  }

  public getRootElem(): HTMLDivElement {
    return this.rootElem;
  }

  public destory(): boolean {
    if (this.isInit) {
      this.isInit = false;

      // destory addButton
      this.addButton.destory();

      // destory home
      if (this.home) {
        this.home.destory();
      }

      // destory fixed
      for (let tab of this.fixed) {
        tab.destory();
      }

      // destory moved
      for (let tab of this.moved) {
        tab.destory();
      }

      // remove from parent
      this.rootElem.parentNode?.removeChild(this.rootElem);

      return true;
    } else {
      return false;
    }
  }

  public flushConfig(): void {
    const config = ConfigRenderer.getConfig().tabBar;
    this.homePath = makeTabPath(
      config.tab.homeWidth,
      config.tab.height,
      config.tab.radius,
    );
    this.fixedPath = makeTabPath(
      config.tab.fixedWidth,
      config.tab.height,
      config.tab.radius,
    );
  }

  public flush(
    isCalculate: boolean,
    isLayout: boolean,
    tabAnimate: boolean,
  ): void {
    const totalWidth = window.innerWidth;
    const config = ConfigRenderer.getConfig().tabBar;
    const r = config.tab.radius;
    const d = r * 2;
    const homeWidth = config.tab.homeWidth;
    const fixedWidth = config.tab.fixedWidth;
    const netHomeWidth = homeWidth - d;
    const netFixedWidth = fixedWidth - d;
    const addButtonWidth = config.addButton.size.width;
    const left = config.left;
    const right = config.right;
    const fixedLen = this.fixed.length;
    const movedLen = this.moved.length;

    if (isCalculate) {
      let netWidth = totalWidth - left - right - homeWidth - addButtonWidth;
      const minNetMoved = config.tab.minMovedWidth - d;
      const maxNetMoved = config.tab.maxMovedWidth - d;
      const showFixed = range(Math.floor(netWidth / netFixedWidth), 0, fixedLen);
      netWidth -= showFixed * netFixedWidth;
      const showMoved = range(Math.floor(netWidth / minNetMoved), 0, movedLen);
      const netMovedWidth = (showMoved > 0 && showMoved === movedLen)
        ? range(netWidth / showMoved, minNetMoved, maxNetMoved)
        : minNetMoved;

      // flush this cache
      this.tabY = config.height - config.tab.height;
      this.showFixed = showFixed;
      this.showMoved = showMoved;
      this.netFixedWidth = netFixedWidth;
      this.netMovedWidth = netMovedWidth;
    } else {
      this.showFixed = Math.min(this.showFixed, this.fixed.length);
      this.showMoved = Math.min(this.showMoved, this.moved.length);
    }

    if (isLayout) {
      const movedWidth = this.netMovedWidth + d;
      const movedPath = makeTabPath(movedWidth, config.tab.height, r);
      let x = left;
      let preTab = this.home;

      // layout home
      this.homeMin = x;
      this.homeMax = x + homeWidth;
      if (this.home) {
        const tab = this.home;
        tab.index = 0;
        tab.setX(x);
        tab.setWidth(homeWidth);
        tab.path = this.homePath;
        tab.setDisplay(true);
        tab.setAnimate(tabAnimate && !tab.isMoving);
        tab.hideSpacer = tab.isMouseOver || tab.isFocus;
      }
      x += netHomeWidth;

      // layout fixed
      this.fixedMin = x;
      this.fixedMax = x + this.showFixed * netFixedWidth + d;
      for (let i = 0; i < this.fixed.length; i++) {
        const tab = this.fixed[i];
        tab.index = i;
        if (!tab.isMoving) {
          tab.setX(x);
        }
        tab.setWidth(fixedWidth);
        tab.path = this.fixedPath;
        if (i < this.showFixed) {
          tab.setDisplay(true);
          x += netFixedWidth;
        } else {
          tab.setDisplay(false);
        }

        tab.setAnimate(tabAnimate && !tab.isMoving);
        tab.hideSpacer = tab.isMouseOver || tab.isFocus;

        if (tab.hideSpacer && !tab.isMoving && preTab) {
          preTab.hideSpacer = true;
        }
        preTab?.flush();
        preTab = tab;
      }

      // layout moved
      this.movedMin = x;
      this.movedMax = x + this.showMoved * this.netMovedWidth + d;
      for (let i = 0; i < this.moved.length; i++) {
        const tab = this.moved[i];
        tab.index = i;
        if (!tab.isMoving) {
          tab.setX(x);
        }
        tab.setWidth(movedWidth);
        tab.path = movedPath;
        if (i < this.showMoved) {
          tab.setDisplay(true);
          x += this.netMovedWidth;
        } else {
          tab.setDisplay(false);
        }
        tab.setAnimate(tabAnimate && !tab.isMoving);
        tab.hideSpacer = tab.isMouseOver || tab.isFocus;

        if (tab.hideSpacer && !tab.isMoving && preTab) {
          preTab.hideSpacer = true;
        }
        preTab?.flush();
        preTab = tab;
      }

      preTab?.flush();

      // layout addButton
      this.addButton.setAnimate(false);
      this.addButton.setX(
        this.showFixed === fixedLen && this.showMoved === movedLen ?
          this.movedMax :
          totalWidth - right - addButtonWidth
      );
    }
  }

  public flushPageData(data?: AppPageData): void {
    if (data) {
      for (let tab of [this.home, ...this.fixed, ...this.moved]) {
        if (tab && tab.data.id === data.id) {
          tab.flushPageData(data);
        }
      }
    }
  }

  ///////////////////// Mouse Event ////////////////////////////////////////////
  private onPointerDown(e: PointerEvent): void {
    e.stopPropagation();
    e.preventDefault();

    const ptMouse = { x: e.clientX, y: e.clientY };

    const tab = this.getTabByPoint(ptMouse.x, ptMouse.y);
    if (tab) {
      this.setFocusTab(tab);
    }

    if (tab) {
      this.movingTab = tab;
      this.mouseDownPoint = {
        x: ptMouse.x - this.movingTab.getX(),
        y: ptMouse.y - this.tabY,
      };
    } else {
      this.mouseDownPoint = ptMouse;
    }

    Browser.callWorkspaceSetWindowResizable(false);
    this.rootElem.setPointerCapture(e.pointerId);
  }

  private onPointerMove(e: PointerEvent): void {
    e.stopPropagation();
    e.preventDefault();

    this.setMouseOverTab(this.getTabByPoint(e.clientX, e.clientY));

    if (this.mouseDownPoint) {
      if (this.movingTab) {
        if (!this.movingTab.isMoving) {
          if (Math.abs(e.clientX - this.movingTab.getX() - this.mouseDownPoint.x) > 5) {
            this.movingTab.isMoving = true;
            this.flush(false, true, true);
          }
        }

        if (this.movingTab.isMoving) {
          this.setTabX(
            this.movingTab,
            e.clientX - this.mouseDownPoint.x,
          );
        }
      } else {
        Browser.callWorkspaceSetWindowPostion(
          this.mouseDownPoint.x,
          this.mouseDownPoint.y,
        );
      }
    }

    this.startCheckMouse();
  }

  private onPointerUp(e: PointerEvent): void {
    e.stopPropagation();
    e.preventDefault();

    this.rootElem.releasePointerCapture(e.pointerId);
    Browser.callWorkspaceSetWindowResizable(true);

    this.mouseDownPoint = undefined;
    if (this.movingTab) {
      this.movingTab.isMoving = false;
      this.movingTab = undefined;
      this.flush(false, true, true);
    }
  }

  public addTab(
    kind: AppPageKind,
    url: string,
    focus: boolean,
    addressFocus: boolean,
    afterId?: number,
  ): boolean {
    const pageId = Browser.callWorkspaceAddPage(kind, url, addressFocus);
    if (pageId < 0) {
      return false;
    }

    const tab = new Tab(new AppPageData(pageId, kind, url));
    this.rootElem.appendChild(tab.getRootElem());

    switch (kind) {
      case AppPageKind.Home:
        this.home = tab;
        break;
      case AppPageKind.Fixed:
        let fixIndex = this.fixed.findIndex(o => o.data.id === afterId);
        if (fixIndex < 0) {
          fixIndex = this.fixed.length - 1;
        }
        this.fixed.splice(fixIndex + 1, 0, tab);
        break;
      case AppPageKind.Moved:
        if (afterId === 0) {
          this.moved.splice(0, 0, tab);
        } else {
          let movIndex = this.moved.findIndex(o => o.data.id === afterId);
          if (movIndex < 0) {
            movIndex = this.moved.length - 1;
          }
          this.moved.splice(movIndex + 1, 0, tab);
        }
        break;
      default:
        return false;
    }

    if (focus) {
      this.flush(true, false, false);
      this.setFocusTab(tab);
      return true;
    } else {
      this.flush(true, true, true);
      return true;
    }
  }

  public deleteTab(pageId: number): boolean {
    if (!Browser.callWorkspaceDeletePage(pageId)) {
      return false;
    }

    let tab: Tab | undefined;

    if (pageId === 0 && (tab = this.home)) {
      this.home = undefined;
    } else if (tab = this.fixed.find(o => o.data.id === pageId)) {
      this.fixed = this.fixed.filter(o => o.data.id !== pageId);
    } else if (tab = this.moved.find(o => o.data.id === pageId)) {
      this.moved = this.moved.filter(o => o.data.id !== pageId);
    } else {
      return false;
    }

    tab.destory();

    if (this.focusTab && this.focusTab.data.id === pageId) {
      let biggestFocusTime = 0;
      let lastFocus: Tab | undefined;
      for (const it of [this.home, ...this.fixed, ...this.moved]) {
        if (it && it.getFocusTimeMS() > biggestFocusTime) {
          biggestFocusTime = it.getFocusTimeMS();
          lastFocus = it;
        }
      }
      if (lastFocus) {
        this.setFocusTab(lastFocus);
      } else {
        this.flush(false, true, true);
      }
    } else {
      this.flush(false, true, true);
    }

    this.addButton.setAnimate(true);
    return true;
  }

  private setFocusTab(tab?: Tab): void {
    if (tab !== this.focusTab) {
      this.focusTab?.setFocus(false);
      this.focusTab = tab;
      this.focusTab?.setFocus(true);
      this.flush(false, true, true);
      Browser.callWorkspaceFocusPage(tab ? tab.data.id : -1);
    }
  }

  private setMouseOverTab(tab?: Tab): void {
    if (tab !== this.mouseOverTab) {
      this.mouseOverTab?.setMouseOver(false);
      this.mouseOverTab = tab;
      this.mouseOverTab?.setMouseOver(true);
      this.flush(false, true, true);
    }
  }

  private startCheckMouse(): void {
    if (this.checkMouseOutHandler === undefined) {
      this.checkMouseOutHandler = setInterval(() => {
        const ptMouse = Browser.callWorkspaceGetMousePosition();
        if (
          ptMouse.x < 0 ||
          ptMouse.x >= this.rootElem.clientWidth ||
          ptMouse.y < 0 ||
          ptMouse.y >= this.rootElem.clientHeight
        ) {
          this.setMouseOverTab(undefined);
          this.flush(true, true, true);
          clearInterval(this.checkMouseOutHandler);
          this.checkMouseOutHandler = undefined;
        }
      }, 150) as any;
    }
  }

  public setTabX(tab: Tab, x: number): boolean {
    switch (tab.data.kind) {
      case AppPageKind.Home:
        return false;
      case AppPageKind.Fixed:
        if (this.fixed.length > 0) {
          x = range(
            x,
            this.fixedMin,
            this.fixedMin + this.netFixedWidth * (this.showFixed - 1),
          );
          tab.setX(x);
          const index = Math.round((x - this.fixedMin) / this.netFixedWidth);
          if (tab.index !== index) {
            this.fixed = this.fixed.filter(o => o.data.id !== tab.data.id);
            this.fixed.splice(index, 0, tab);
            this.flush(false, true, true);
          }
          return true;
        } else {
          return false;
        }
      case AppPageKind.Moved:
        if (this.moved.length > 0) {
          x = range(
            x,
            this.movedMin,
            this.movedMin + this.netMovedWidth * (this.showMoved - 1),
          );
          tab.setX(x);
          const index = Math.round((x - this.movedMin) / this.netMovedWidth);
          if (tab.index !== index) {
            this.moved = this.moved.filter(o => o.data.id !== tab.data.id);
            this.moved.splice(index, 0, tab);
            this.flush(true, true, true);
          }
          return true;
        } else {
          return false;
        }
      default:
        return false;
    }
  }

  public getTabByPoint(x: number, y: number): Tab | undefined {
    let array: Array<Tab> = [];

    if (this.ctx) {
      if (this.home && x >= this.homeMin && x < this.homeMax) {
        const tab = this.home;
        if (this.ctx.isPointInPath(tab.path, x - tab.getX(), y - this.tabY)) {
          array.push(tab);
        }
      }

      if (x >= this.fixedMin && x < this.fixedMax) {
        const start = range(
          Math.floor((x - this.fixedMin) / this.netFixedWidth),
          0,
          this.fixed.length,
        );

        for (
          let i = Math.max(start - 1, 0);
          i < Math.min(start + 2, this.fixed.length);
          i++
        ) {
          const tab = this.fixed[i];
          if (tab.isDisplay() && this.ctx.isPointInPath(
            tab.path,
            x - tab.getX(),
            y - this.tabY,
          )) {
            array.push(tab);
          }
        }
      }

      if (x >= this.movedMin && x < this.movedMax) {
        const start = range(
          Math.floor((x - this.movedMin) / this.netMovedWidth),
          0,
          this.moved.length
        );
        for (
          let i = Math.max(start - 1, 0);
          i < Math.min(start + 2, this.moved.length);
          i++
        ) {
          const tab = this.moved[i];
          if (tab.isDisplay() && this.ctx.isPointInPath(
            tab.path,
            x - tab.getX(),
            y - this.tabY,
          )) {
            array.push(tab);
          }
        }
      }
    }

    if (array.length === 1) {
      return array[0];
    } else if (array.length === 2) {
      const left = array[0];
      const right = array[1];
      return left.getWeight() > right.getWeight() ? left : right;
    } else {
      return undefined;
    }
  }
}

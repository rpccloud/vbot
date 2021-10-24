import { range, makeTabPath, getSeed, getMousePointer } from "./utils";
import tabConfig, { IPoint } from "./defs";
import { Tab } from "./tab";
import { ThemeConfig } from "../../../../ui/theme/config";

export class TabBar {
  private isInit: boolean;
  private ctx?: CanvasRenderingContext2D;
  private rootElem: HTMLDivElement;
  private checkMouseOutHandler?: number;

  private movingTab?: Tab;
  private mouseOverTab?: Tab;
  private focusTab?: Tab;
  private mouseDownPoint?: IPoint;

  private home?: Tab;
  private moved: Array<Tab>;

  private tabY: number;
  private showMoved: number;
  private netMovedWidth: number;
  private homePath: Path2D;

  private homeMin: number;
  private homeMax: number;
  private movedMin: number;
  private movedMax: number;
  private onWindowResize: () => void;
  private onChange: (focus: string, list: Array<string>) => void

  public constructor(onChange: (focus: string, list: Array<string>) => void) {
    const ctx = document.createElement("canvas").getContext("2d");
    this.isInit = true;
    this.ctx = ctx ? ctx : undefined;
    this.rootElem = document.createElement("div");
    this.rootElem.style.height = `${tabConfig.tabBarHeight}px`;

    this.checkMouseOutHandler = undefined;
    this.movingTab = undefined;
    this.mouseOverTab = undefined;
    this.focusTab = undefined;
    this.mouseDownPoint = undefined;

    this.home = undefined;
    this.moved = [];

    this.tabY = 0;
    this.showMoved = 0;
    this.netMovedWidth = 0;
    this.homePath = new Path2D();

    this.homeMin = 0;
    this.homeMax = 0;
    this.movedMin = 0;
    this.movedMax = 0;

    this.onChange = onChange
    this.onWindowResize = () => {
        this.flush(true, true, false);
    }

    this.rootElem.addEventListener("pointerdown", e => {
      this.onPointerDown(e);
    });
    this.rootElem.addEventListener("pointerup", e => {
      this.onPointerUp(e);
    });
    this.rootElem.addEventListener("pointermove", e => {
      this.onPointerMove(e);
    });

    this.flushTheme();

    window.addEventListener("resize", this.onWindowResize)
  }

  public getRootElem(): HTMLDivElement {
    return this.rootElem;
  }

  public destroy(): boolean {
    if (this.isInit) {
      this.isInit = false;

      window.removeEventListener("resize", this.onWindowResize)

      // destroy home
      if (this.home) {
        this.home.destroy();
      }

      // destroy moved
      for (let tab of this.moved) {
        tab.destroy();
      }

      // remove from parent
      this.rootElem.parentNode?.removeChild(this.rootElem);

      return true;
    } else {
      return false;
    }
  }

  public flushTheme(): void {
      const theme = ThemeConfig.get()
    this.homePath = makeTabPath(
      tabConfig.tabHomeWidth,
      tabConfig.tabHeight,
      tabConfig.tabRadius,
    );

    this.rootElem.style.borderBottom = `1px solid ${theme.borderColor}`
  }

  public flush(
    isCalculate: boolean,
    isLayout: boolean,
    tabAnimate: boolean,
  ): void {
    const totalWidth = window.innerWidth;
    const homeWidth = tabConfig.tabHomeWidth;
    const netHomeWidth = homeWidth;
    const left = tabConfig.tabBarLeft;
    const right = tabConfig.tabBarRight;
    const movedLen = this.moved.length;

    if (isCalculate) {
      let netWidth = totalWidth - left - right - homeWidth;
      const minNetMoved = tabConfig.tabMinWidth;
      const maxNetMoved = tabConfig.tabMaxWidth;
      const showMoved = range(Math.floor(netWidth / minNetMoved), 0, movedLen);
      const netMovedWidth = (showMoved > 0 && showMoved === movedLen)
        ? range(netWidth / showMoved, minNetMoved, maxNetMoved)
        : minNetMoved;

      // flush this cache
      this.tabY = tabConfig.tabBarHeight - tabConfig.tabHeight;
      this.showMoved = showMoved;
      this.netMovedWidth = netMovedWidth;
    } else {
      this.showMoved = Math.min(this.showMoved, this.moved.length);
    }

    if (isLayout) {
      const movedWidth = this.netMovedWidth;
      const movedPath = makeTabPath(movedWidth, tabConfig.tabHeight, tabConfig.tabRadius);
      let x = left;

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
      }
      x += netHomeWidth;
      this.home?.flush()

      // layout moved
      this.movedMin = x;
      this.movedMax = x + this.showMoved * this.netMovedWidth;
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
        tab.flush();
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
      }
    }

    this.startCheckMouse();
  }

  private onPointerUp(e: PointerEvent): void {
    e.stopPropagation();
    e.preventDefault();

    this.rootElem.releasePointerCapture(e.pointerId);
    this.mouseDownPoint = undefined;
    if (this.movingTab) {
      this.movingTab.isMoving = false;
      this.movingTab = undefined;
      this.flush(false, true, true);
    }
  }

  public addTab(
    isHome: boolean,
    param: string,
    focus: boolean,
    title: string,
    icon: React.ReactElement,
    afterId?: number,
  ): boolean {
    const tab = new Tab(this, isHome, getSeed(), title,  icon, param);
    this.rootElem.appendChild(tab.getRootElem());
    if (isHome) {
        this.home = tab;
    } else {
        if (afterId === 0) {
            this.moved.splice(0, 0, tab);
          } else {
            let movIndex = this.moved.findIndex(o => o.id === afterId);
            if (movIndex < 0) {
              movIndex = this.moved.length - 1;
            }
            this.moved.splice(movIndex + 1, 0, tab);
          }
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
    let tab: Tab | undefined = this.moved.find(o => o.id === pageId)

    if (pageId === 0 && (tab = this.home)) {
      this.home = undefined;
    } else if (!!tab) {
      this.moved = this.moved.filter(o => o.id !== pageId);
    } else {
      return false;
    }

    tab.destroy();

    if (this.focusTab && this.focusTab.id === pageId) {
      let biggestFocusTime = 0;
      let lastFocus: Tab | undefined;
      for (const it of [this.home, ...this.moved]) {
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

    this.onTabChange()
    return true;
  }

  private setFocusTab(tab?: Tab): void {
    if (tab !== this.focusTab) {
      this.focusTab?.setFocus(false);
      this.focusTab = tab;
      this.focusTab?.setFocus(true);
      this.flush(false, true, true);
      this.onTabChange()
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
        const ptMouse = getMousePointer()
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
      if (tab.isHome) {
          return false
      } else if (this.moved.length > 0) {
            x = range(
              x,
              this.movedMin,
              this.movedMin + this.netMovedWidth * (this.showMoved - 1),
            );
            tab.setX(x);
            const index = Math.round((x - this.movedMin) / this.netMovedWidth);
            if (tab.index !== index) {
              this.moved = this.moved.filter(o => o.id !== tab.id);
              this.moved.splice(index, 0, tab);
              this.flush(true, true, true);
              this.onTabChange();
            }
            return true;
          } else {
            return false;
          }

  }

    private onTabChange() {
        let params = new Array<string>()

        if (this.home) {
            params.push(this.home.getParam())
        }

        for (let i = 0; i < this.moved.length; i++) {
            params.push(this.moved[i].getParam())
        }

        this.onChange(this.focusTab?.getParam() || "",params)
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

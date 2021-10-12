import { RoundButton } from "./button";
import { ConfigRenderer } from "./config-renderer";
import { AppPageState } from "./defs";
import { Browser } from "./main";

class PrevButton extends RoundButton {
  public constructor(onClick: () => void) {
    super("pageBar-prev", onClick);
    this.flushConfig();
  }

  public flushConfig(): void {
    super.flushConfig(ConfigRenderer.getConfig().pageBar.prevButton);
  }

  protected drawForeground(ctx: CanvasRenderingContext2D): boolean {
    const config = this.config;
    if (config) {
      const w = config.size.width;
      const h = config.size.height;
      const fgSize = config.fgSize;

      ctx.beginPath();
      ctx.moveTo(w / 2, (h - fgSize) / 2);
      ctx.lineTo((w - fgSize) / 2, h / 2);
      ctx.lineTo(w / 2, (h + fgSize) / 2);
      ctx.moveTo((w - fgSize) / 2, h / 2);
      ctx.lineTo((w + fgSize) / 2, h / 2);

      ctx.strokeStyle = this.isActive ? config.fgColor : config.fgColorInactive;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.stroke();
      return true;
    } else {
      return false;
    }
  }
}

class NextButton extends RoundButton {
  public constructor(onClick: () => void) {
    super("pageBar-next", onClick);
    this.flushConfig();
  }

  public flushConfig(): void {
    super.flushConfig(ConfigRenderer.getConfig().pageBar.nextButton);
  }

  protected drawForeground(ctx: CanvasRenderingContext2D): boolean {
    const config = this.config;
    if (config) {
      const w = config.size.width;
      const h = config.size.height;
      const fgSize = config.fgSize;

      ctx.beginPath();
      ctx.moveTo(w / 2, (h - fgSize) / 2);
      ctx.lineTo((w + fgSize) / 2, h / 2);
      ctx.lineTo(w / 2, (h + fgSize) / 2);
      ctx.moveTo((w - fgSize) / 2, h / 2);
      ctx.lineTo((w + fgSize) / 2, h / 2);

      ctx.strokeStyle = this.isActive ? config.fgColor : config.fgColorInactive;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.stroke();
      return true;
    } else {
      return false;
    }
  }
}

class ReloadButton extends RoundButton {
  private state: AppPageState;
  private onReload: () => void;
  private onStop: () => void;

  public constructor(onReload: () => void, onStop: () => void) {
    super("pageBar-reload", () => {
      this.isStop() ? this.onStop() : this.onReload();
    });
    this.state = AppPageState.Closed;
    this.onReload = onReload;
    this.onStop = onStop;
    this.flushConfig();
  }

  public flushConfig(): void {
    super.flushConfig(ConfigRenderer.getConfig().pageBar.reloadButton);
  }

  public setState(state: AppPageState): void {
    if (this.state !== state) {
      this.state = state;
      this.flushConfig();
    }
  }

  protected drawForeground(ctx: CanvasRenderingContext2D): boolean {
    return this.isStop() ? this.drawStop(ctx) : this.drawReload(ctx);
  }

  private isStop(): boolean {
    return this.state === AppPageState.Loading ||
      this.state === AppPageState.Leaving;
  }

  private drawStop(ctx: CanvasRenderingContext2D): boolean {
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

  protected drawReload(ctx: CanvasRenderingContext2D): boolean {
    const config = this.config;
    if (config) {
      const w = config.size.width;
      const h = config.size.height;
      const fgSize = config.fgSize;
      const radius = fgSize / 2;
      const arrowSize = radius * 0.5;
      const deltaX = radius * Math.sqrt(3) / 2;
      const deltaY = radius / 2;

      ctx.beginPath();
      ctx.arc(
        w / 2,
        h / 2,
        radius,
        Math.PI * 0.08,
        Math.PI * 11 / 6,
      );

      ctx.moveTo(w / 2 + deltaX, h / 2 - deltaY - arrowSize);
      ctx.lineTo(w / 2 + deltaX, h / 2 - deltaY);
      ctx.lineTo(w / 2 + deltaX - arrowSize, h / 2 - deltaY);

      ctx.strokeStyle = this.isActive ? config.fgColor : config.fgColorInactive;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.stroke();
      return true;
    } else {
      return false;
    }
  }
}

class MoreButton extends RoundButton {
  public constructor(onClick: () => void) {
    super("pageBar-more", onClick);
    this.flushConfig();
  }

  public flushConfig(): void {
    super.flushConfig(ConfigRenderer.getConfig().pageBar.moreButton);
  }

  protected drawForeground(ctx: CanvasRenderingContext2D): boolean {
    const config = this.config;
    if (config) {
      const w = config.size.width;
      const h = config.size.height;
      const fgSize = config.fgSize - 2;

      ctx.beginPath();
      ctx.arc(w / 2, (h - fgSize) / 2, 1.5, 0, Math.PI * 2);
      ctx.arc(w / 2, h / 2, 1.5, 0, Math.PI * 2);
      ctx.arc(w / 2, (h + fgSize) / 2, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = this.isActive ? config.fgColor : config.fgColorInactive;
      ctx.fill();
      return true;
    } else {
      return false;
    }
  }
}

class Address {
  private isInit: boolean;
  private focus: boolean;
  private rootElem: HTMLDivElement;
  private formElem: HTMLFormElement;
  private inputElem: HTMLInputElement;

  private receivedValue?: string;
  private focusStartValue?: string;
  private onSetAddress?: (url: string) => void;
  private onFocusChange?: (isFocus: boolean) => void;

  public constructor(
    onSetAddress: (url: string) => void,
    onFocusChange: (isFocus: boolean) => void,
  ) {
    this.isInit = true;
    this.focus = false;
    this.onSetAddress = onSetAddress;
    this.onFocusChange = onFocusChange;
    this.rootElem = document.createElement("div");
    this.rootElem.className = "pageBar-address";

    this.formElem = document.createElement("form");
    this.formElem.className = "pageBar-form";
    this.inputElem = document.createElement("input");
    this.inputElem.className = "pageBar-address-input";

    this.inputElem.addEventListener("pointerdown", e => {
      this.onPointerDown(e);
    });
    this.inputElem.addEventListener("blur", e => {
      this.onBlur(e);
    });
    this.formElem.addEventListener("submit", e => {
      this.onSubmit(e);
    });

    this.inputElem.addEventListener("compositionstart", () => {
      this.inputElem.style.textDecoration = "underline";
    });

    this.inputElem.addEventListener("compositionend", () => {
      this.inputElem.style.textDecoration = "none";
    });

    this.formElem.appendChild(this.inputElem);
    this.rootElem.appendChild(this.formElem);
  }

  public getRootElem(): HTMLDivElement {
    return this.rootElem;
  }

  public setFocus(focus: boolean): void {
    if (this.focus !== focus) {
      this.focus = focus;

      if (this.onFocusChange) {
        this.onFocusChange(focus);
      }

      if (focus) {
        this.inputElem.focus();
        this.focusStartValue = this.inputElem.value;
      } else {
        this.inputElem.blur();
        if (
          this.inputElem.value === this.focusStartValue &&
          this.receivedValue !== undefined
        ) {
          this.inputElem.value = this.receivedValue;
        }
        this.focusStartValue = undefined;
        this.receivedValue = undefined;
      }
    }
  }

  public isFocus(): boolean {
    return this.focus;
  }

  public setValue(value: string): void {
    if (this.inputElem.value !== value) {
      if (this.focus) {
        this.receivedValue = value;
      } else {
        this.inputElem.value = value;
      }
    }
  }

  public destory(): void {
    if (this.isInit) {
      this.onSetAddress = undefined;
      this.isInit = false;
      this.rootElem.parentNode?.removeChild(this.rootElem);
    }
  }

  private onPointerDown(e: PointerEvent): void {
    if (!this.focus) {
      e.stopPropagation();
      e.preventDefault();
      this.setFocus(true);
      this.inputElem.select();
    }
  }

  private onBlur(e: FocusEvent): void {
    if (this.focus) {
      e.stopPropagation();
      e.preventDefault();
      this.setFocus(false);
    }
  }

  private onSubmit(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    this.setFocus(false);

    if (this.onSetAddress) {
      this.onSetAddress(this.inputElem.value);
    }
  }
}

export class PageBarContent {
  private pageId: number;
  private isAttach: boolean;
  private rootElem: HTMLDivElement;
  private prevButton: PrevButton;
  private nextButton: NextButton;
  private reloadButton: ReloadButton;
  private address: Address;
  private moreButton: MoreButton;

  public constructor(pageId: number, canGoBack: boolean, canGoForward: boolean) {
    this.pageId = pageId;
    this.isAttach = false;
    this.rootElem = document.createElement("div");
    this.rootElem.className = "pageBar-content";

    this.address = new Address(url => {
      Browser.callWorkspaceNavigatePage(this.pageId, url);
    }, isFocus => {
      if (this.isAttach) {
        Browser.callWorkspaceSetAddressFocus(this.pageId, isFocus);
      }
    });

    this.prevButton = new PrevButton(() => {
      Browser.callWorkspaceGoBackPage(this.pageId);
    });
    this.prevButton.setActive(canGoBack);

    this.nextButton = new NextButton(() => {
      Browser.callWorkspaceGoForwardPage(this.pageId);
    });
    this.nextButton.setActive(canGoForward);

    this.reloadButton = new ReloadButton(
      () => {
        Browser.callWorkspaceReloadPage(this.pageId);
      },
      () => {
        Browser.callWorkspaceStopPage(this.pageId);
      },
    );

    this.moreButton = new MoreButton(() => {
      alert(`Click more button ${this.pageId}`);
    });

    this.rootElem.appendChild(this.prevButton.getRootElem());
    this.rootElem.appendChild(this.nextButton.getRootElem());
    this.rootElem.appendChild(this.reloadButton.getRootElem());
    this.rootElem.appendChild(this.address.getRootElem());
    this.rootElem.appendChild(this.moreButton.getRootElem());
  }

  public destory(): void {
    this.prevButton.destory();
    this.nextButton.destory();
    this.reloadButton.destory();
    this.address.destory();
    this.moreButton.destory();

    this.detach();
  }

  public getRootElem(): HTMLDivElement {
    return this.rootElem;
  }

  public fixedShowHideFocusBug(): void {
    if (Browser.callWorkspaceGetAddressFocus(this.pageId)) {
      this.address.setFocus(false);
      this.address.setFocus(true);
    }
  }

  public attach(parentNode: HTMLDivElement): void {
    if (!this.isAttach) {
      this.isAttach = true;
      parentNode.appendChild(this.rootElem);

      if (Browser.callWorkspaceGetAddressFocus(this.pageId)) {
        this.address.setFocus(true);
      }
    }
  }

  public detach(): void {
    if (this.isAttach) {
      this.isAttach = false;
      Browser.callWorkspaceSetAddressFocus(this.pageId, this.address.isFocus());
      this.rootElem.parentNode?.removeChild(this.rootElem);
    }
  }

  public setAddress(url: string): void {
    this.address.setValue(url);
  }

  public setState(state: AppPageState): void {
    this.reloadButton.setState(state);
  }

  public setCanGoBack(canGoBack: boolean): void {
    this.prevButton.setActive(canGoBack);
  }

  public setCanGoForward(canGoForward: boolean): void {
    this.nextButton.setActive(canGoForward);
  }
}

export class PageBar {
  private rootElem: HTMLDivElement;
  private content?: PageBarContent;
  private spacerElem: HTMLDivElement;

  public constructor() {
    this.rootElem = document.createElement("div");
    this.rootElem.className = "pageBar";

    this.spacerElem = document.createElement("div");
    this.spacerElem.className = "pageBar-spacer";
    this.rootElem.appendChild(this.spacerElem);
  }

  public getRootElem(): HTMLDivElement {
    return this.rootElem;
  }

  public setContent(content: PageBarContent): void {
    if (this.content !== content) {
      this.content?.detach();
      this.content = content;
      this.content.attach(this.rootElem);
    }
  }
}

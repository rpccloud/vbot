import { RPCRenderer } from "./rpc-renderer";
import { ConfigRenderer } from "./config-renderer";
import { TabBar } from "./tab-bar";
import { AppPageKind, IPoint } from "./defs";
import { PageBar } from "./page";

export class Browser {
  private static instance: Browser = new Browser();

  public static Get(): Browser {
    return Browser.instance;
  }

  private rpc: RPCRenderer;
  private rootElem: HTMLDivElement;
  private tabBar: TabBar;
  private pageBar: PageBar;

  private constructor() {
    // add css
    const cssElem = document.createElement("style");
    cssElem.appendChild(document.createTextNode(Browser.callWorkspaceGetCSS()));
    document.head.appendChild(cssElem);

    this.rootElem = document.createElement("div");
    this.rootElem.className = "browser";
    this.tabBar = new TabBar();
    this.pageBar = new PageBar();
    this.rootElem.appendChild(this.tabBar.getRootElem());
    this.rootElem.appendChild(this.pageBar.getRootElem());
    document.body.appendChild(this.rootElem);

    this.rpc = RPCRenderer.register(`#${ConfigRenderer.getId()}.browser`);

    this.rpc.on("WindowShow", () => {
      this.tabBar.fixedShowHideFocusBug();
    });

    this.rpc.on("WindowResize", () => {
      this.tabBar.flush(true, true, false);
    });

    this.rpc.on("PageDataUpdate", data => {
      this.tabBar.flushPageData(data);
    });

    this.rpc.on("AddTab", (kind, url, focus, addressFocus, afterId) => {
      this.tabBar.addTab(kind, url, focus, addressFocus, afterId);
    });
  }

  public getPageBar(): PageBar {
    return this.pageBar;
  }

  public getTabBar(): TabBar {
    return this.tabBar;
  }

  public static callWorkspaceGetCSS(): string {
    return RPCRenderer.call(
      `#${ConfigRenderer.getId()}.workspace`,
      "GetCSS",
    );
  }

  public static callWorkspaceAddPage(kind: AppPageKind, url: string, addressFocus: boolean): number {
    return RPCRenderer.call(
      `#${ConfigRenderer.getId()}.workspace`,
      "AddPage",
      kind,
      url,
      addressFocus,
    );
  }

  public static callWorkspaceNavigatePage(pageId: number, url: string): boolean {
    return RPCRenderer.call(
      `#${ConfigRenderer.getId()}.workspace`,
      "NavigatePage",
      pageId,
      url,
    );
  }

  public static callWorkspaceGetAddressFocus(pageId: number): boolean {
    return RPCRenderer.call(
      `#${ConfigRenderer.getId()}.workspace`,
      "GetAddressFocus",
      pageId,
    );
  }

  public static callWorkspaceSetAddressFocus(pageId: number, isFocus: boolean): boolean {
    return RPCRenderer.call(
      `#${ConfigRenderer.getId()}.workspace`,
      "SetAddressFocus",
      pageId,
      isFocus
    );
  }

  public static callWorkspaceGoBackPage(pageId: number): boolean {
    return RPCRenderer.call(
      `#${ConfigRenderer.getId()}.workspace`,
      "GoBackPage",
      pageId,
    );
  }

  public static callWorkspaceGoForwardPage(pageId: number): boolean {
    return RPCRenderer.call(
      `#${ConfigRenderer.getId()}.workspace`,
      "GoForwardPage",
      pageId,
    );
  }

  public static callWorkspaceStopPage(pageId: number): boolean {
    return RPCRenderer.call(
      `#${ConfigRenderer.getId()}.workspace`,
      "StopPage",
      pageId,
    );
  }

  public static callWorkspaceReloadPage(pageId: number): boolean {
    return RPCRenderer.call(
      `#${ConfigRenderer.getId()}.workspace`,
      "ReloadPage",
      pageId,
    );
  }

  public static callWorkspaceFocusPage(pageId: number): boolean {
    return RPCRenderer.call(
      `#${ConfigRenderer.getId()}.workspace`,
      "FocusPage",
      pageId,
    );
  }

  public static callWorkspaceDeletePage(pageId: number): number {
    return RPCRenderer.call(
      `#${ConfigRenderer.getId()}.workspace`,
      "DeletePage",
      pageId,
    );
  }

  public static callWorkspaceGetMousePosition(): IPoint {
    return RPCRenderer.call(
      `#${ConfigRenderer.getId()}.workspace`,
      "GetMousePosition",
    );
  }

  public static callWorkspaceSetWindowPostion(x: number, y: number): IPoint {
    return RPCRenderer.call(
      `#${ConfigRenderer.getId()}.workspace`,
      "SetWindowPostion",
      Math.round(x),
      Math.round(y),
    );
  }

  public static callWorkspaceSetWindowResizable(resizable: boolean): boolean {
    return RPCRenderer.call(
      `#${ConfigRenderer.getId()}.workspace`,
      "SetWindowResizable",
      resizable,
    );
  }
}

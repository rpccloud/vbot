export interface IPoint {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum AppPageKind {
  Home,
  Fixed,
  Moved,
}

export enum AppPageState {
  Closed,
  Leaving,
  Loading,
  Loaded,
}

export class AppPageData {
  public readonly id: number;
  public readonly kind: AppPageKind;
  public url: string;
  public title: string;
  public favicon: string;
  public state: AppPageState;
  public canGoBack: boolean;
  public canGoForward: boolean;
  public seq: number;


  public constructor(id: number, kind: AppPageKind, url: string) {
    this.id = id;
    this.kind = kind;
    this.url = url;
    this.title = "";
    this.favicon = "";
    this.state = AppPageState.Closed;
    this.canGoBack = false;
    this.canGoForward = false;
    this.seq = 0;
  }
}

export interface ITabIndex {
  kind: AppPageKind;
  idx: number;
}


export interface IButtonConfig {
  size: ISize;
  bgColorPress: string;
  bgColorMouseOver: string;
  bgColorMouseOut: string;
  fgColor: string;
  fgColorInactive: string;
  fgSize: number;
}

export interface IFaviconConfig {
  size: ISize;
  loadingColor: string;
  leavingColor: string;
}

export interface ISpacerConfig {
  height: number;
  color: string;
}

export interface ITitleConfig {
  height: number;
  fontSize: number;
  fontColor: string;
  focusFontColor: string;
}

export interface ITabConfig {
  leftMargin: number;
  rightMargin: number;
  inMargin: number;
  radius: number;
  height: number;
  homeWidth: number;
  fixedWidth: number;
  minMovedWidth: number;
  maxMovedWidth: number;
  disappearCloseWidth: number;
  bgColor: string;
  focusOpacity: number;
  mouseOverOpacity: number;
  favicon: IFaviconConfig;
  title: ITitleConfig;
  closeButton: IButtonConfig;
  spacer: ISpacerConfig;
}

export interface ITabBarConfig {
  height: number;
  left: number;
  right: number;
  bgColor: string;
  tab: ITabConfig;
}

export interface IPageBarConfig {
  height: number;
  bgColor: string;

  leftMargin: number;
  rightMargin: number;
  inMargin: number;

  prevButton: IButtonConfig;
  nextButton: IButtonConfig;
  reloadButton: IButtonConfig;
  addressBar: IAddressBarConfig;
  moreButton: IButtonConfig;

  spacerColor: string;
}

export interface IAddressBarConfig {
  height: number;
  left: number;
  right: number;
  borderColor: string;
  caretColor: string;
  fontSize: number;
  fontColor: string;
  fontColorSelected: string;
  fontColorBGSelected: string;
  bgColor: string;
  hoverBGColor: string;
}

export interface IAppConfig {
  currentWorkspace: string;
  appRect: IRect;
  appScreenSize: ISize;
  appColor: string;
  tabBar: ITabBarConfig;
  pageBar: IPageBarConfig;
}

export const IPCRenderChannelCreate = "$IPCRenderChannelCreate";
export const IPCRenderChannelDelete = "$IPCRenderChannelDelete";
export const IPCRenderChannelTransport = "$IPCRenderChannelTransport";


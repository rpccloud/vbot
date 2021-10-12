export interface IPoint {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}

export enum AppPageKind {
  Home,
  Moved,
}

export class AppPageData {
  public readonly id: number;
  public readonly kind: AppPageKind;
  public url: string;
  public title: string;
  public favicon: string;
  public canGoBack: boolean;
  public canGoForward: boolean;
  public seq: number;

  public constructor(id: number, kind: AppPageKind, url: string) {
    this.id = id;
    this.kind = kind;
    this.url = url;
    this.title = "";
    this.favicon = "";
    this.canGoBack = false;
    this.canGoForward = false;
    this.seq = 0;
  }
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
  minMovedWidth: number;
  maxMovedWidth: number;
  disappearCloseWidth: number;
  bgColor: string;
  title: ITitleConfig;
  closeButton: IButtonConfig;
}

export interface ITabBarConfig {
  height: number;
  left: number;
  right: number;
  bgColor: string;
  tab: ITabConfig;
}

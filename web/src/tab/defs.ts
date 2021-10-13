export interface IPoint {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IButtonConfig {
  top:  number;
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
  borderColor: string;
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

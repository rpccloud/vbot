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

const tabConfig = {
    tabBarHeight: 46,
    tabBarLeft: 0,
    tabBarRight: 0,

    tabLeft: 8,
    tabRight: 8,
    tabInMargin: 6,
    tabRadius: 4,
    tabHeight: 30,
    tabMinWidth: 50,
    tabMaxWidth: 200,
    tabDisappearCloseWidth: 80,

    titleHeight: 18,

    closeBtnWidth: 18,
    closeBtnHeight: 18,
    closeBtnSize: 7,
}

export default tabConfig

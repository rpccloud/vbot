export interface IPoint {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IButtonConfig {
  size: ISize;
  bgColor: string;
  focusOpacity: string;
  mouseOverOpacity: string;
  mouseOutOpacity: string;
}

export interface ITitleConfig {
  height: number;
  fontSize: number;
  fontColor: string;
  focusFontColor: string;
}


const tabConfig = {
    tabBarHeight: 46,
    tabBarLeft: 0,
    tabBarRight: 0,

    tabLeft: 12,
    tabRight: 12,
    tabInMargin: 6,
    tabRadius: 4,
    tabHeight: 34,
    tabMinWidth: 50,
    tabMaxWidth: 200,
    tabDisappearCloseWidth: 80,
    tabHomeWidth: 100,
    titleHeight: 18,

    closeBtnWidth: 18,
    closeBtnHeight: 18,
    closeBtnSize: 7,
}

export default tabConfig

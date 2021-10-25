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

    tabLeft: 6,
    tabRight: 6,
    tabInMargin: 3,
    tabRadius: 4,
    tabHeight: 34,
    tabMinWidth: 55,
    tabMaxWidth: 200,
    tabDisappearCloseWidth: 80,
    tabHomeWidth: 100,

    iconWidth: 18,
    iconHeight: 18,
    titleHeight: 18,

    closeBtnWidth: 18,
    closeBtnHeight: 18,
    closeBtnSize: 7,
};

export default tabConfig;

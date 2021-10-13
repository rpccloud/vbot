import {
  ITabBarConfig,
} from "./defs";

export class TabConfig {
  private static config: ITabBarConfig = TabConfig.createTabConfig();

  public static get(): ITabBarConfig {
    return TabConfig.config;
  }

  private static createTabConfig(): ITabBarConfig {
    return {
        height: 46,
        left: 0,
        right: 0,
        bgColor: "#202124",
        tab: {
          leftMargin: 8,
          rightMargin: 8,
          inMargin: 6,
          radius: 5,
          height: 30,
          homeWidth: 100,
          minMovedWidth: 50,
          maxMovedWidth: 200,
          disappearCloseWidth: 80,
          bgColor: "#35363A",
          borderColor: "red",
          title: {
            height: 18,
            fontSize: 13,
            fontColor: "#BBBBBB",
            focusFontColor: "#FFFFFF",
          },
          closeButton: {
            size: { width: 18, height: 18 },
            bgColorPress: "#666666C0",
            bgColorMouseOver: "#66666680",
            bgColorMouseOut: "#66666600",
            fgColor: "#CCCCCC",
            fgColorInactive: "#888888",
            fgSize: 7,
          },
        }
      }
  }
}

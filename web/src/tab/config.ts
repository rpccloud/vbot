import {
  ITabBarConfig,
} from "./defs";

import { getHashParam } from "./utils";

export class TabConfig {
  private static config: ITabBarConfig = TabConfig.createTabConfig();

  public static get(): ITabBarConfig {
    return TabConfig.config;
  }

  private static createTabConfig(): ITabBarConfig {
    return {
        height: 42,
        left: 0,
        right: 8,
        bgColor: "#202124",
        tab: {
          leftMargin: 8,
          rightMargin: 8,
          inMargin: 6,
          radius: 8,
          height: 35,
          homeWidth: 100,
          fixedWidth: 50,
          minMovedWidth: 50,
          maxMovedWidth: 250,
          disappearCloseWidth: 100,
          bgColor: "#35363A",
          focusOpacity: 1,
          mouseOverOpacity: 0.6,
          favicon: {
            size: { width: 18, height: 18 },
            loadingColor: "#BBBBBB",
            leavingColor: "#BBBBBB"
          },
          title: {
            height: 18,
            fontSize: 13,
            fontColor: "#BBBBBB",
            focusFontColor: "#FFFFFF",
          },
          spacer: {
            height: 18,
            color: "#606060",
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

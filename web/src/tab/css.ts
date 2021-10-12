

import {
    IButtonConfig,
    ITabBarConfig,
    ITabConfig,
  } from "./defs";
  import { stringColorToRGBA } from "./utils";

  function getAbsoluteButtonCSS(
    config: IButtonConfig,
    className: string,
    x: number,
    y: number,
  ): string {
    return `
      .${className} {
        left: ${x}px;
        top: ${y}px;
        width: ${config.size.width}px;
        height: ${config.size.height}px;
        background-color: ${config.bgColorMouseOut};
        position: absolute;
        transition: background-color 0.20s ease-out;
        border-radius: 50%;
      }
      .${className}_mousedown {
        background-color: ${config.bgColorPress};
      }
      .${className}_mouseover {
        background-color: ${config.bgColorMouseOver};
      }
      .${className}-canvas {
        width: 100%;
        height: 100%;
        user-select: none;
      }
    `;
  }

  export function getTabBarCSS(config: ITabBarConfig): string {
    return `
      .tabBar {
        height: ${config.height}px;
        background-color: ${config.bgColor};
      }
      .tabBar-bg {
        width: 100%;
        height: 100%;
      }
      ${getTabCSS(config.tab, config.height - config.tab.height)}
    `;
  }

  function getTabCSS(config: ITabConfig, y: number): string {
    // update title color css
    const colorA = stringColorToRGBA(config.title.fontColor, 255);
    const colorB = stringColorToRGBA(config.title.fontColor, 0);
    const colorC = stringColorToRGBA(config.title.focusFontColor, 255);
    const colorD = stringColorToRGBA(config.title.focusFontColor, 0);

    const closeButtonCSS = getAbsoluteButtonCSS(
      config.closeButton,
      "tab-closeButton",
      0,
      (config.height - config.closeButton.size.height) / 2,
    );

    return `
      .tab {
        position: absolute;
        top: ${y}px;
        height: ${config.height}px;
        overflow: hidden;
      }
      .tab_animate {
        transition: left 0.20s ease-out;
      }
      .tab-bg {
        transition: opacity 0.20s ease-out;
        opacity: 0.5 !important;
      }
      .tab-bg_mouseover {
        opacity: 0.8 !important;
      }
      .tab-bg_focus {
        opacity: 1 !important;
      }
      .tab-title {
        -webkit-background-clip: text !important;
        display: table-cell;
        vertical-align: middle;
        white-space: nowrap;
        color: transparent;
        user-select: none;
        pointer-events: none;
        top: ${(config.height - config.title.height) / 2}px;
        width: 300px;
        position: absolute;
        lineHeight: ${config.title.height}px;
        background: linear-gradient(
          to right, ${colorA} 0%, ${colorA} 95%, ${colorB} 100%
        );
      }
      .tab-title_focus {
        background: linear-gradient(
          to right, ${colorC} 0%, ${colorC} 95%, ${colorD} 100%
        );
      }
      .tab-title-content {
        float:left;
        font-size: ${config.title.fontSize}px;
      }
      ${closeButtonCSS}
    `;
  }


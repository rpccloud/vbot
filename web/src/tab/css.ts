

import {
    ITabBarConfig,
    ITabConfig,
  } from "./defs";
  import { stringColorToRGBA } from "./utils";


  export function getTabBarCSS(config: ITabBarConfig): string {
    return `
      ${getTabCSS(config.tab, config.height - config.tab.height)}
    `;
  }

  function getTabCSS(config: ITabConfig, y: number): string {
    // update title color css
    const colorA = stringColorToRGBA(config.title.fontColor, 255);
    const colorB = stringColorToRGBA(config.title.fontColor, 0);
    const colorC = stringColorToRGBA(config.title.focusFontColor, 255);
    const colorD = stringColorToRGBA(config.title.focusFontColor, 0);

    return `
      .browser-tab {
        position: absolute;
        top: ${y}px;
        height: ${config.height}px;
        overflow: hidden;
      }
      .browser-tab_animate {
        transition: left 0.20s ease-out;
      }
      .browser-tab-bg {
        transition: opacity 0.20s ease-out;
        opacity: 0.5 !important;
      }
      .browser-tab-bg_mouseover {
        opacity: 0.8 !important;
      }
      .browser-tab-bg_focus {
        opacity: 1 !important;
      }
      .browser-tab-title {
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
      .browser-tab-title_focus {
        background: linear-gradient(
          to right, ${colorC} 0%, ${colorC} 95%, ${colorD} 100%
        );
      }
      .browser-tab-title-content {
        float:left;
        font-size: ${config.title.fontSize}px;
      }
    `;
  }


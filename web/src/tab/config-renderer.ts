import {
  IButtonConfig,
  ITabConfig,
  ITabBarConfig,
  IPageBarConfig,
  IAppConfig,
} from "./defs";
import { RPCRenderer } from "./rpc-renderer";
import { getHashParam } from "./utils";

export type ButtonConfig = IButtonConfig;
export type TabConfig = ITabConfig;
export type TabBarConfig = ITabBarConfig;
export type PageBarConfig = IPageBarConfig;
export type AppConfig = IAppConfig;

export class ConfigRenderer {
  private static id: number;
  private static config: AppConfig = ConfigRenderer.initConfig();

  public static getConfig(): AppConfig {
    return ConfigRenderer.config;
  }

  public static getId(): number {
    return ConfigRenderer.id;
  }

  private static initConfig(): AppConfig {
    const hash = getHashParam();
    if (hash.type !== "Browser") {
      throw new Error(
        "ConfigRenderer only available in browser renderer process",
      );
    }

    const config = hash.params.config as AppConfig;

    ConfigRenderer.id = hash.params.id as number;

    if (!(ConfigRenderer.id > 0)) {
      throw new Error(
        "ConfigRenderer can not get the params by hash",
      );
    }

    const channel = RPCRenderer.register(`#${ConfigRenderer.id}.config`);
    channel.on("SystemConfigUpdate", newConfig => {
      ConfigRenderer.config = newConfig;
    });

    return config;
  }
}

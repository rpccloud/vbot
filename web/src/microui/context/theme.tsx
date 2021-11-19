import React from "react";
import {
    DefaultColor,
    extendConfig,
    PaletteColor,
    SeedManager,
    TimerManager,
    Transition,
} from "../util";

export interface Theme {
    default?: DefaultColor;
    primary?: PaletteColor;
    hover?: PaletteColor;
    highlight?: PaletteColor;
    focus?: PaletteColor;
    selected?: PaletteColor;
    successful?: PaletteColor;
    failed?: PaletteColor;
    disabled?: PaletteColor;
    transition?: Transition;
}

export class ThemeCache {
    private configMap = new Map<string, { timeMS: number; config: any }>();
    private onGet: (theme: Theme) => any;

    constructor(onGet: (theme: Theme) => any) {
        this.onGet = onGet;
        TimerManager.get().attach(this);
    }

    onTimer(nowMS: number): void {
        this.configMap.forEach((item, key) => {
            if (nowMS - item.timeMS > 10000) {
                this.configMap.delete(key);
            }
        });
    }

    getConfig(theme: Theme): any {
        const key = getThemeHashKey(theme);
        let item = this.configMap.get(key);

        if (!item) {
            item = {
                timeMS: TimerManager.get().getNowMS(),
                config: this.onGet(theme),
            };
            this.configMap.set(key, item);
        }

        return item.config;
    }
}

const themeIDPropertyName = "@-micro-ui-theme-id-#";

export function extendTheme(left: Theme, right: Theme | undefined): Theme {
    const leftHash = getThemeHashKey(left);
    const rightHash = getThemeHashKey(right);

    if (leftHash.endsWith(rightHash)) {
        return left;
    }

    const ret = extendConfig({ ...left }, { ...right });
    ret[themeIDPropertyName] = `${leftHash}-${rightHash}`;
    return ret;
}

export function getThemeHashKey(theme: Theme | undefined): string {
    if (theme === undefined) {
        return "@";
    }

    let o = theme as { [key: string]: any };

    if (o.hasOwnProperty(themeIDPropertyName)) {
        return o[themeIDPropertyName];
    } else {
        o[themeIDPropertyName] = `${SeedManager.getSeed()}`;
        return o[themeIDPropertyName];
    }
}

export const ThemeContext = React.createContext<Theme>({
    default: {
        pageBackground:
            "radial-gradient(circle farthest-side, rgb(7, 20, 41), rgb(10,30,70)",
        contrastText: "#FFFFFFD0",
        outline: "#999",
        divider: "rgb(15, 35, 90)",
    },
    primary: {
        main: "#b26500",
        contrastText: "#FFFFFFD0",
    },
    hover: {
        main: "#ff9100",
        contrastText: "#FFFFFFD0",
    },
    highlight: {
        main: "#ffa733",
        contrastText: "#FFFFFFFF",
    },
    focus: {
        main: "#ffa733",
        contrastText: "#FFFFFFD0",
    },
    selected: {
        main: "#ff9100",
        contrastText: "#FFFFFFD0",
    },
    successful: {
        main: "#76ff03",
        contrastText: "#FFFFFFD0",
    },
    failed: {
        main: "rgb(235, 0, 20)",
        contrastText: "#FFFFFFD0",
    },
    disabled: {
        main: "#555",
        contrastText: "#808080C0",
    },
    transition: {
        duration: "300ms",
        easing: "ease-in-out",
    },
});

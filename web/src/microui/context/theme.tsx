import React from "react";
import {
    extendConfig,
    PaletteColor,
    SeedManager,
    TimerManager,
    Transition,
} from "../util";

export interface Theme {
    default?: PaletteColor;
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
        main: "#000",
        contrastText: "#FFFFFFD0",
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
        main: "yellow",
        contrastText: "#FFFFFFD0",
    },
    successful: {
        main: "#76ff03",
        contrastText: "#FFFFFFD0",
    },
    failed: {
        main: "#e91e63",
        contrastText: "#FFFFFFD0",
    },
    disabled: {
        main: "#555",
        contrastText: "#808080C0",
    },
    transition: {
        duration: "220ms",
        easing: "ease-in-out",
    },
});

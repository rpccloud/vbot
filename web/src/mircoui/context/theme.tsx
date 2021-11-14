import React from "react";
import { Theme } from "../config";

// export class Theme {
//     public default: ThemeItem;
//     public primary: ThemeItem;
//     public successful: ThemeItemSimple;
//     public failed: ThemeItemSimple;
//     public disabled: ThemeItemSimple;

//     constructor(o: {
//         default: ThemeItem;
//         primary: ThemeItem;
//         successful: ThemeItemSimple;
//         failed: ThemeItemSimple;
//         disabled: ThemeItemSimple;
//     }) {
//         this.default = o.default;
//         this.primary = o.primary;
//         this.successful = o.successful;
//         this.failed = o.failed;
//         this.disabled = o.disabled;
//     }

//     hashKey(): string {
//         return [
//             this.default.light,
//             this.default.main,
//             this.default.dark,
//             this.default.contrastText,
//             this.primary.light,
//             this.primary.main,
//             this.primary.dark,
//             this.primary.contrastText,
//             this.successful.main,
//             this.successful.contrastText,
//             this.failed.main,
//             this.failed.contrastText,
//             this.disabled.main,
//             this.disabled.contrastText,
//         ].join("-");
//     }

//     extend(o: ITheme): Theme {
//         return new Theme(
//             extendConfig(
//                 {
//                     default: this.default,
//                     primary: this.primary,
//                     successful: this.successful,
//                     failed: this.failed,
//                     disabled: this.disabled,
//                 },
//                 o
//             ) as any
//         );
//     }
// }

export const ThemeContext = React.createContext<Theme>({
    default: {
        main: "#000",
        hover: "#222",
        highlight: "#444",
        contrastText: "#FFFFFFC0",
    },
    primary: {
        main: "#8e24aa",
        hover: "#9c27b0",
        highlight: "#ab47bc",
        contrastText: "#FFFFFFC0",
    },
    successful: {
        main: "#76ff03",
        contrastText: "#FFFFFFC0",
    },
    failed: {
        main: "#e91e63",
        contrastText: "#FFFFFFC0",
    },
    disabled: {
        main: "#37474f",
        contrastText: "#FFFFFFC0",
    },
});

import React from "react";

export class ThemeConfig {
    primaryColor: string
    borderColor: string
    fontColor: string
    errorColor: string
    successColor: string
    dividerColor: string
    shadowColor: string
    maskColor: string
    fontSizeSmall: string
    fontSizeMiddle: string
    fontSizeLarge: string
    fontWeight: number

    constructor(o: {
        primaryColor: string
        borderColor: string
        fontColor: string
        errorColor: string
        successColor: string
        dividerColor: string
        shadowColor: string
        maskColor: string
        fontSizeSmall: string
        fontSizeMiddle: string
        fontSizeLarge: string
        fontWeight: number
    }) {
        this.primaryColor = o.primaryColor
        this.borderColor = o.borderColor
        this.fontColor = o.fontColor
        this.errorColor = o.errorColor
        this.successColor = o.successColor
        this.dividerColor = o.dividerColor
        this.shadowColor = o.shadowColor
        this.maskColor = o.maskColor
        this.fontSizeSmall = o.fontSizeSmall
        this.fontSizeMiddle = o.fontSizeMiddle
        this.fontSizeLarge = o.fontSizeLarge
        this.fontWeight = o.fontWeight
    }

    public setPrimaryColor(v: string): ThemeConfig {
        let ret = new ThemeConfig(this)
        ret.primaryColor = v
        return ret
    }
}

const themes = {
    light: new ThemeConfig({
        primaryColor: "rgb(255, 159, 51)",
        borderColor: "rgb(150, 150, 150)",
        fontColor: "rgba(255, 255, 255, 0.85)",
        errorColor: "rgb(236, 20, 20)",
        successColor: "rgb(27, 199, 21)",
        dividerColor: "rgb(110, 110, 110)",
        shadowColor: "rgb(150, 150, 150)",
        maskColor: "rgba(0,0, 0, 0.1)",
        fontSizeSmall: "12px",
        fontSizeMiddle: "16px",
        fontSizeLarge: "22px",
        fontWeight: 400,
    }),
    dark: new ThemeConfig({
        primaryColor: "rgb(255, 159, 51)",
        borderColor: "rgb(150, 150, 150)",
        fontColor: "rgba(255, 255, 255, 0.85)",
        errorColor: "rgb(236, 20, 20)",
        successColor: "rgb(27, 199, 21)",
        dividerColor: "rgb(110, 110, 110)",
        shadowColor: "rgb(150, 150, 150)",
        maskColor: "rgba(0,0, 0, 0.1)",
        fontSizeSmall: "12px",
        fontSizeMiddle: "16px",
        fontSizeLarge: "22px",
        fontWeight: 400,
    })
}

const Theme = React.createContext<ThemeConfig>(themes.dark)

export default Theme

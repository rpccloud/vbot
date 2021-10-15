import React from "react";
import { makeAutoObservable } from "mobx";
import { ConfigProvider } from "antd";

import 'antd/dist/antd.variable.min.css'
import "./base/base.scss"
import "./base/antd.scss"
import "./component/icon.scss"

export const config = {
    light: {
        default: {
            primaryColor: "rgb(24, 144, 255)",
            infoColor: "rgb(44, 105, 238)",
            successColor: "rgb(27, 199, 21)",
            processingColor: "rgb(218, 189, 24)",
            errorColor: "rgb(236, 20, 20)",
            warningColor: "rgb(185, 78, 64)",
            backgroundColor: "rgb(230, 232, 235)",
            backgroundColorLighten: "rgb(255, 255, 255)",
            backgroundColorDarken: "rgb(215, 217, 220)",
            fontColor: "rgba(0, 0, 0, 0.8)",
            fontColorLighten:  "rgba(0, 0, 0, 0.6)",
            fontColorDarken:  "rgba(0, 0, 0, 1)",
            borderColor: "rgb(150, 150, 150)",
            borderColorLighten: "rgb(180, 180, 180)",
            borderColorDarken: "rgb(100, 100, 100)",
            shadowColor: "rgb(170, 170, 170)",
            dividerColor: "rgb(210, 210, 210)",
            disabledColor: "rgb(195, 195, 195)",
            disabledBackground: "rgb(235, 235, 235)"
        }
    },
    dark: {
        default: {
            primaryColor: "rgb(255, 159, 51)",
            infoColor: "rgb(44, 105, 238)",
            successColor: "rgb(27, 199, 21)",
            processingColor: "rgb(218, 189, 24)",
            errorColor: "rgb(236, 20, 20)",
            warningColor: "rgb(185, 78, 64)",
            backgroundColor: "rgb(25, 25, 25)",
            backgroundColorLighten: "rgb(50, 50, 50)",
            backgroundColorDarken: "rgb(0, 0, 0)",
            fontColor: "rgba(255, 255, 255, 0.85)",
            fontColorLighten: "rgba(255, 255, 255, 0.6)",
            fontColorDarken: "rgba(255, 255, 255, 1)",
            borderColor: "rgb(150, 150, 150)",
            borderColorLighten: "rgb(100, 100, 100)",
            borderColorDarken: "rgb(180, 180, 180)",
            shadowColor: "rgb(150, 150, 150)",
            dividerColor: "rgb(110, 110, 110)",
            disabledColor: "rgb(100, 100, 100)",
            disabledBackground: "rgb(40, 40, 40)"
        }
    }
}

export class ThemeConfig {
    primaryColor: string
    infoColor: string
    successColor: string
    processingColor: string
    errorColor: string
    warningColor: string
    backgroundColor: string
    backgroundColorLighten: string
    backgroundColorDarken: string
    fontColor: string
    fontColorLighten: string
    fontColorDarken: string
    borderColor: string
    borderColorLighten: string
    borderColorDarken: string
    shadowColor: string
    dividerColor: string
    disabledColor: string
    disabledBackground: string

    fontSizeSmall: string
    fontSizeMedium: string
    fontSizeLarge: string

    fontWeightLighter: number
    fontWeightNormal: number
    fontWeightBold: number
    fontWeightBolder: number

    constructor(o: {
        primaryColor: string,
        infoColor: string,
        successColor: string,
        processingColor: string,
        errorColor: string,
        warningColor: string,
        backgroundColor: string,
        backgroundColorLighten: string,
        backgroundColorDarken: string,
        fontColor: string,
        fontColorLighten: string,
        fontColorDarken: string,
        borderColor: string,
        borderColorLighten: string,
        borderColorDarken: string,
        shadowColor: string,
        dividerColor: string,
        disabledColor: string,
        disabledBackground: string,
    }) {
        makeAutoObservable(this)
        this.primaryColor = o.primaryColor
        this.infoColor = o.infoColor
        this.successColor = o.successColor
        this.processingColor = o.processingColor
        this.errorColor = o.errorColor
        this.warningColor = o.warningColor
        this.backgroundColor = o.backgroundColor
        this.backgroundColorLighten = o.backgroundColorLighten
        this.backgroundColorDarken = o.backgroundColorDarken
        this.fontColor = o.fontColor
        this.fontColorLighten = o.fontColorLighten
        this.fontColorDarken = o.fontColorDarken
        this.borderColor = o.borderColor
        this.borderColorLighten = o.borderColorLighten
        this.borderColorDarken = o.borderColorDarken
        this.shadowColor = o.shadowColor
        this.dividerColor = o.dividerColor
        this.disabledColor = o.disabledColor
        this.disabledBackground = o.disabledBackground

        this.fontSizeSmall = "12px"
        this.fontSizeMedium = "16px"
        this.fontSizeLarge = "22px"

        this.fontWeightLighter = 200
        this.fontWeightNormal = 400
        this.fontWeightBold = 700
        this.fontWeightBolder = 900

        const docStyle = document.documentElement.style
        docStyle.setProperty("--Vbot-PrimaryColor", this.primaryColor)
        docStyle.setProperty("--Vbot-InfoColor", this.infoColor)
        docStyle.setProperty("--Vbot-SuccessColor", this.successColor)
        docStyle.setProperty("--Vbot-ProcessingColor", this.processingColor)
        docStyle.setProperty("--Vbot-ErrorColor", this.errorColor)
        docStyle.setProperty("--Vbot-WarningColor", this.warningColor)
        docStyle.setProperty("--Vbot-BackgroundColor", this.backgroundColor)
        docStyle.setProperty("--Vbot-BackgroundColorLighten", this.backgroundColorLighten)
        docStyle.setProperty("--Vbot-BackgroundColorDarken", this.backgroundColorDarken)
        docStyle.setProperty("--Vbot-FontColor", this.fontColor)
        docStyle.setProperty("--Vbot-FontColorLighten", this.fontColorLighten)
        docStyle.setProperty("--Vbot-FontColorDarken", this.fontColorDarken)
        docStyle.setProperty("--Vbot-ShadowColor", this.shadowColor)
        docStyle.setProperty("--Vbot-BorderColor", this.borderColor)
        docStyle.setProperty("--Vbot-BorderColorLighten", this.borderColorLighten)
        docStyle.setProperty("--Vbot-BorderColorDarken", this.borderColorDarken)
        docStyle.setProperty("--Vbot-DividerColor", this.dividerColor)
        docStyle.setProperty("--Vbot-DisabledColor", this.disabledColor)
        docStyle.setProperty("--Vbot-DisabledBackground", this.disabledBackground)

        ConfigProvider.config({
            theme: {
                primaryColor: this.primaryColor,
                infoColor: this.infoColor,
                successColor: this.successColor,
                processingColor: this.processingColor,
                errorColor: this.errorColor,
                warningColor: this.warningColor,
            },
        });
    }

    public setPrimaryColor(v: string): ThemeConfig {
        let ret = new ThemeConfig(this)
        ret.primaryColor = v
        return ret
    }

    private static instance = new ThemeConfig(config.dark.default)
    public static get(): ThemeConfig {
        return ThemeConfig.instance
    }
}

const Theme = React.createContext<ThemeConfig>(ThemeConfig.get())

export default Theme

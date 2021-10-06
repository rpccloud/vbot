import { ConfigProvider } from "antd"

import 'antd/dist/antd.variable.min.css';
import "./theme/base/base.scss";
import "./theme/base/antd.scss";
import "./theme/component/icon.scss";

export const Themes = {
    light: {
        primaryColor: "rgb(24, 144, 255)",
        infoColor: "rgb(44, 105, 238)",
        successColor: "rgb(27, 199, 21)",
        processingColor: "rgb(218, 189, 24)",
        errorColor: "rgb(236, 20, 20)",
        warningColor: "rgb(185, 78, 64)",
        backgroundColor: "rgb(235, 236, 237)",
        backgroundColorLighten: "rgb(255, 255, 255)",
        backgroundColorDarken: "rgb(220, 222, 224)",
        fontColor: "rgba(0, 0, 0, 0.85)",
        fontColorLighten:  "rgba(0, 0, 0, 0.6)",
        fontColorDarken:  "rgba(0, 0, 0, 0.95)",
        shadowColor: "rgb(150, 150, 150)",
        dividerColor: "rgb(160, 160, 160)",
        disabledColor: "rgb(195, 195, 195)",
        disabledBackground: "rgb(235, 235, 235)"
    },
    dark: {
        primaryColor: "rgb(255, 159, 51)",
        infoColor: "rgb(44, 105, 238)",
        successColor: "rgb(27, 199, 21)",
        processingColor: "rgb(218, 189, 24)",
        errorColor: "rgb(236, 20, 20)",
        warningColor: "rgb(185, 78, 64)",
        backgroundColor: "rgb(25, 25, 25)",
        backgroundColorLighten: "rgb(38, 38, 38)",
        backgroundColorDarken: "rgb(6, 6, 6)",
        fontColor: "rgb(200, 200, 200)",
        fontColorLighten: "rgb(100, 100, 100)",
        fontColorDarken: "rgb(240, 240, 240)",
        shadowColor: "rgb(255, 255, 255)",
        dividerColor: "rgb(120, 120, 120)",
        disabledColor: "rgb(70, 70, 70)",
        disabledBackground: "rgb(40, 40, 40)"
    }
}

export function setAppTheme(theme: {
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
    shadowColor: string,
    dividerColor: string,
    disabledColor: string,
    disabledBackground: string,
}) {
    ConfigProvider.config({
        theme: {
            primaryColor: theme.primaryColor,
            infoColor: theme.infoColor,
            successColor: theme.successColor,
            processingColor: theme.processingColor,
            errorColor: theme.errorColor,
            warningColor: theme.warningColor,
        },
    });

    const docStyle = document.documentElement.style
    docStyle.setProperty("--Vbot-PrimaryColor", theme.primaryColor)
    docStyle.setProperty("--Vbot-InfoColor", theme.infoColor)
    docStyle.setProperty("--Vbot-SuccessColor", theme.successColor)
    docStyle.setProperty("--Vbot-ProcessingColor", theme.processingColor)
    docStyle.setProperty("--Vbot-ErrorColor", theme.errorColor)
    docStyle.setProperty("--Vbot-WarningColor", theme.warningColor)
    docStyle.setProperty("--Vbot-BackgroundColor", theme.backgroundColor)
    docStyle.setProperty("--Vbot-BackgroundColorLighten", theme.backgroundColorLighten)
    docStyle.setProperty("--Vbot-BackgroundColorDarken", theme.backgroundColorDarken)
    docStyle.setProperty("--Vbot-FontColor", theme.fontColor)
    docStyle.setProperty("--Vbot-FontColorLighten", theme.fontColorLighten)
    docStyle.setProperty("--Vbot-FontColorDarken", theme.fontColorDarken);
    docStyle.setProperty("--Vbot-ShadowColor", theme.shadowColor);
    docStyle.setProperty("--Vbot-DividerColor", theme.dividerColor);

    docStyle.setProperty("--Vbot-DisabledColor", theme.disabledColor);
    docStyle.setProperty("--Vbot-DisabledBackground", theme.disabledBackground);
}


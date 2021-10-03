import { ConfigProvider } from "antd"

import 'antd/dist/antd.variable.min.css';
import "./theme/base/base.scss";
import "./theme/base/antd.scss";
import "./theme/component/icon.scss";

export const Themes = {
    light: {
        primaryColor: "rgb(98, 141, 235)",
        infoColor: "rgb(44, 105, 238)",
        successColor: "rgb(27, 199, 21)",
        processingColor: "rgb(218, 189, 24)",
        errorColor: "rgb(236, 20, 20)",
        warningColor: "rgb(185, 78, 64)",
        backgroundColor: "rgb(233, 235, 238)",
        backgroundColorLighten: "rgb(255, 255, 255)",
        backgroundColorDarken: "rgb(225, 227, 230)",
        fontColor: "rgb(60, 60, 60)",
        fontColorLighten: "rgb(128, 128, 128)",
        fontColorDarken: "rgb(25, 25, 25)",
        shadowColor: "rgb(130, 133, 138)",
        dividerColor: "rgb(220, 222, 225)",
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
}


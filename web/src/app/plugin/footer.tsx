import React, { useContext } from "react";
import { FlexBox } from "../../microui/component/FlexBox";
import { Span } from "../../microui/component/Span";
import { ThemeContext } from "../../microui/context/theme";
import { AppConfig } from "../AppManager";

const Footer = () => {
    const theme = useContext(ThemeContext);
    return (
        <FlexBox
            style={{
                justifyContent: "center",
                alignItems: "center",
                minHeight: AppConfig.get().footerHeight,
            }}
        >
            <Span
                size="small"
                style={{
                    color: theme.disabled?.contrastText,
                }}
            >
                Copyright rpccloud.com ©2021 Created by tianshuo
            </Span>
        </FlexBox>
    );
};

export default Footer;

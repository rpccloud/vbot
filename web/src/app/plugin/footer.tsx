import React, { useContext } from "react";
import { FlexBox } from "../../microui/component/FlexBox";
import { Span } from "../../microui/component/Span";
import { ThemeContext } from "../../microui/context/theme";
import { AppConfig } from "../AppManager";

const Footer = () => {
    const theme = useContext(ThemeContext);
    return (
        <FlexBox>
            <Span
                size="small"
                text="Copyright rpccloud.com ©2021 Created by tianshuo"
                style={{
                    color: theme.disabled?.contrastText,
                    minHeight: AppConfig.get().footerHeight,
                }}
            />
        </FlexBox>
    );
};

export default Footer;

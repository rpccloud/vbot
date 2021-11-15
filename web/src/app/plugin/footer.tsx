import React, { useContext } from "react";
import { FlexBox } from "../../microui/component/FlexBox";
import { ThemeContext } from "../../microui/context/theme";
import { AppConfig } from "../AppManager";

const Footer = () => {
    const theme = useContext(ThemeContext);
    return (
        <FlexBox
            size="small"
            style={{
                color: theme.disabled?.contrastText,
                height: AppConfig.get().footerHeight,
            }}
        >
            Copyright rpccloud.com ©2021 Created by tianshuo
        </FlexBox>
    );
};

export default Footer;

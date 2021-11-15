import React from "react";
import { FlexBox } from "../../microui/component/FlexBox";
import { Span } from "../../microui/component/Span";
import { AppConfig } from "../AppManager";

const Header = () => {
    return (
        <FlexBox
            justifyContent="flex-start"
            flexFlow="row"
            style={{
                fontWeight: 700,
                minHeight: AppConfig.get().headHeight,
            }}
        >
            <Span
                size="x-large"
                text="Vbot"
                style={{ marginLeft: AppConfig.get().margin }}
            />
        </FlexBox>
    );
};

export default Header;

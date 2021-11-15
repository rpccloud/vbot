import React from "react";
import { FlexBox } from "../../microui/component/FlexBox";
import { AppConfig } from "../AppManager";

const Header = () => {
    return (
        <FlexBox
            justifyContent="flex-start"
            flexFlow="row"
            size="large"
            style={{
                fontWeight: 700,
                height: AppConfig.get().headHeight,
            }}
        >
            <div style={{ marginLeft: AppConfig.get().margin }}>Vbot</div>
        </FlexBox>
    );
};

export default Header;

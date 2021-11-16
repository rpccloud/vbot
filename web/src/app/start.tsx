import React from "react";
import { AppConfig, AppError, AppUser } from "./AppManager";
import { observer } from "mobx-react-lite";
import { delay } from "../util/util";
import Plugin from "./plugin";
import { Page } from "../microui/component/Page";
import { Spin } from "../microui/component/Spin";
import { FlexBox } from "../microui/component/FlexBox";
import { Span } from "../microui/component/Span";

export const Start = observer((props: any) => {
    setTimeout(async () => {
        try {
            let ret = await AppUser.send(3000, "#.user:IsInitialized");
            if (ret) {
                AppConfig.get().setRootRoute("login");
            } else {
                AppConfig.get().setRootRoute("register");
            }
        } catch (e) {
            AppError.get().report(e);
            await delay(2000);
        }
    });

    return (
        <Page>
            <Plugin kind="header" />
            <FlexBox
                animated={true}
                flexFlow="row"
                style={{
                    flex: "1 0 0",
                }}
            >
                <Spin size="x-large" />
                <Span size="x-large" style={{ marginLeft: 24 }}>
                    Loading ...
                </Span>
            </FlexBox>
            <Plugin kind="footer" />
        </Page>
    );
});

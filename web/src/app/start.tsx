import React from "react";
import { AppConfig, AppError, AppUser, ExtraColor } from "./AppManager";
import { observer } from "mobx-react-lite";
import { Plugin } from "./plugin";
import { Page } from "../microui/component/Page";
import { Spin } from "../microui/component/Spin";
import { FlexBox } from "../microui/component/FlexBox";
import { Span } from "../microui/component/Span";
import { sleep } from "../microui/util";

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
            await sleep(2000);
        }
    });

    return (
        <Page
            style={{
                background: `radial-gradient(circle farthest-side, ${ExtraColor.appBG}, ${ExtraColor.appDarkBG})`,
            }}
        >
            <Plugin kind="header" />
            <FlexBox
                animated={true}
                style={{
                    flex: "1",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Spin size="x-large" />
                <Span
                    size="x-large"
                    style={{ marginLeft: AppConfig.get().margin }}
                >
                    Loading ...
                </Span>
            </FlexBox>
            <Plugin kind="footer" />
        </Page>
    );
});

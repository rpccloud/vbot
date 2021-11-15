import React from "react";
import { AppConfig, AppUser } from "./AppManager";
import { observer } from "mobx-react-lite";
import { delay } from "../util/util";
import Plugin from "./plugin";
import { Page } from "../microui/component/Page";
import { Spin } from "../microui/component/Spin";
import { FlexBox } from "../microui/component/FlexBox";

export const Start = observer((props: any) => {
    // setTimeout(async () => {
    //     try {
    //         let ret = await AppUser.send(3000, "#.user:IsInitialized");
    //         if (ret) {
    //             AppConfig.get().setRootRoute("login");
    //         } else {
    //             AppConfig.get().setRootRoute("register");
    //         }
    //     } catch (e) {
    //         //   message.error((e as any).getMessage());
    //         await delay(2000);
    //     }
    // });

    return (
        <Page style={{ display: "flex", flexFlow: "column" }}>
            <Plugin kind="header" />
            <FlexBox
                flexFlow="row"
                style={{
                    flex: "1 0 0",
                }}
                size="x-large"
            >
                <Spin size="xx-large" />
                <div style={{ marginLeft: 24 }}>Loading ...</div>
            </FlexBox>
            <Plugin kind="footer" />
        </Page>
    );
});

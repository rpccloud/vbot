import React from "react";
import { message, Spin } from "antd";
import { AppData, AppUser } from "./AppManager";
import { observer } from "mobx-react-lite";
import { delay } from "../util/util";
import Plugin from "./plugin";

const styles = {
    text: {
        fontSize: "var(--Vbot-FontSizeLarge)",
        color: "var(--Vbot-FontColor)",
        marginLeft: 16,
    },
};

const StartPage = observer((props: any) => {
    setTimeout(async () => {
        try {
            let ret = await AppUser.send(3000, "#.user:IsInitialized");
            if (ret) {
                AppData.get().setRootRoute("login");
            } else {
                AppData.get().setRootRoute("register");
            }
        } catch (e) {
            message.error((e as any).getMessage());
            await delay(2000);
        }
    });

    return (
        <div
            className="vbot-fill-viewport"
            style={{ display: "flex", flexFlow: "column" }}
        >
            <Plugin kind="header" />
            <div
                style={{ display: "flex", flex: "1 0 0", flexFlow: "row" }}
                className="vbot-container-center"
            >
                <Spin size="large" />
                <div style={styles.text}>Loading ...</div>
            </div>
            <Plugin kind="footer" />
        </div>
    );
});

export default StartPage;

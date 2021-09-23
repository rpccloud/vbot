import React from "react";
import { Button, DatePicker } from "antd";
import { gAppData, gThemeManager } from "../../AppManager";

export default function Login() {
    return (
        <div>
        <DatePicker />
        <Button onClick={async () => {
            gThemeManager.setDark()
            gAppData.setLang("zh-CN")
            }}>zh-CN</Button>
        <Button onClick={async () => {
                        gThemeManager.setLight()
            gAppData.setLang("en-US")
            }}>en-US</Button>
        <div className={"red"}>{gAppData.locale?.app.register.title1}</div>
        </div>
    )
}

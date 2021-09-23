import React from "react";
import { Button, DatePicker } from "antd";
import { AppData, AppTheme } from "../../AppManager";

export default function Login() {
    return (
        <div>
            <DatePicker />
            <Button onClick={async () => {
                AppTheme.get().setDark()
                AppData.get().setLang("zh-CN")
                }}>zh-CN</Button>
            <Button onClick={async () => {
                AppTheme.get().setLight()
                AppData.get().setLang("en-US")
                }}>en-US</Button>
            <div className={"red"}>{AppData.get().locale?.app.register.title1}</div>
        </div>
    )
}

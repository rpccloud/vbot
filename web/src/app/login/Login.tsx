import React from "react";
import { Button, DatePicker } from "antd";
import { gAppData } from "../AppData";

export default function Login() {
    return (
        <div>
        <DatePicker />
        <Button onClick={async () => {
            gAppData.setLang("zh-CN")
            gAppData.setDisplayMode("light")
            }}>zh-CN</Button>
        <Button onClick={async () => {
            gAppData.setLang("en-US")
            gAppData.setDisplayMode("dark")
            }}>en-US</Button>
        </div>
    )
}

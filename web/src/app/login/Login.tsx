import React from "react";
import { Button, DatePicker } from "antd";
import { gAppData } from "../AppData";

export default function Login() {
    return (
        <div>
        <DatePicker />
        <Button onClick={async () => {
            gAppData.setLang("zh-CN")
            }}>zh-CN</Button>
        <Button onClick={async () => {
            gAppData.setLang("en-US")
            }}>en-US</Button>
        </div>
    )
}

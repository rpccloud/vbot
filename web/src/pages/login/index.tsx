import React, { useState } from "react";
import { Button, DatePicker, Modal } from "antd";
import { AppData, AppTheme } from "../../AppManager";

export default function Login() {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
      setIsModalVisible(true);
    };

    const handleOk = () => {
      setIsModalVisible(false);
    };

    const handleCancel = () => {
      setIsModalVisible(false);
    };

    return (
        <>
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

            <Button type="primary" onClick={showModal}>
                Open Modal
            </Button>
            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>
    )
}

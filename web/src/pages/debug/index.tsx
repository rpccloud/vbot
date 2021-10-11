import React from "react";
import Input from "../../ui/component/Input";
import {
    UserOutlined,
} from '@ant-design/icons';


export default function Debug() {
    return (
        <div>
            <div style={{margin: 100}}>
                <Input
                    size="large"
                    label="Password:"
                    type="password"
                    value={""}
                    prefixIcon={<UserOutlined/>}
                    onSubmit={v => {}}
                    validator={(v): boolean => {
                        return v.length > 10
                    }}
                />
                <div style={{height: 100}}></div>
                <Input size="large" type="text" onSubmit={v => {}}/>
                <div style={{height: 100}}></div>
                <input style={{backgroundColor: "transparent"}}/>
            </div>
        </div>
    )
}


import React from "react";

import { message } from 'antd';
import { observer } from "mobx-react-lite";
import Card from "../../component/Card";
import { AppUser } from "../../AppManager";

interface ServerDeleteProps {
    param: any,
}

const ServerDelete = observer((props: ServerDeleteProps) => {
    let item = props.param.item
    return (
        <Card
            title="Remove SSH"
            width={500}
            height={240}
            prevName= "Cancel"
            onPrev={() => {
                if (props.param && props.param.goBack) {
                    props.param.goBack(false)
                }
            }}
            nextName="Delete"
            onNext={async () => {
                try {
                    await AppUser.send(
                        8000, "#.server:Delete", AppUser.getSessionID(), item.id,
                    )
                    props.param.goBack(true)
                } catch(e) {
                    message.error((e as any).getMessage())
                    props.param.goBack(false)
                }
            }}
        >
            <div style={{color: "var(--Vbot-FontColor)"}}>
                Are you sure to remove ssh item "{item.user}@{item.host}:{item.port}" ?
            </div>
        </Card>
    )
})

export default ServerDelete

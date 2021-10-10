import React, { useContext } from "react";
import Input from "../../ui/component/Input";
import ThemeConfig from "../../ui/theme/config";


export default function Debug() {
    const config = useContext(ThemeConfig);

    return (
        <div>
            <div style={{margin: 100}}>
                <Input size="large" editable={true}></Input>

                <Input size="large" editable={true}></Input>
            </div>
        </div>

    )
}


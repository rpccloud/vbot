import React from "react";
import VLayout from "../../component/VLayout";

export default function Debug() {
    return (
        <div style={{height: 200, width: 200}}>
        <VLayout.Container>
            <VLayout.Fixed>
                <div>Hello</div>
            </VLayout.Fixed>
            <VLayout.Dynamic>
                <div>Hello</div>
            </VLayout.Dynamic>
            <VLayout.Fixed>
                <div>Hello</div>
            </VLayout.Fixed>
            <VLayout.Fixed>
                <div>Hello</div>
            </VLayout.Fixed>
        </VLayout.Container>
        </div>
    )
}

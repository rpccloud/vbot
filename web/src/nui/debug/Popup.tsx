import React from "react";
import { Divider } from "..//components/Divider";
import { DebugUnit } from "./DebugUnit";
import { Span } from "../components/Span";
import { Popup } from "../components/Popup";
import { Button } from "../components/Button";

export const DebugPopup = (props: {}) => {
    return (
        <div style={{ padding: 16 }}>
            <Span size="xx-large">Popup</Span>
            <Divider space={16} />
            <div style={{ display: "flex", flexFlow: "row", flexWrap: "wrap" }}>
                <DebugUnit title="Spin-default" width={150} height={150}>
                    <Popup
                        renderPopup={() => {
                            return (
                                <div
                                    style={{
                                        width: 100,
                                        height: 100,
                                        background: "red",
                                    }}
                                ></div>
                            );
                        }}
                    >
                        <Button />
                    </Popup>
                </DebugUnit>
            </div>
        </div>
    );
};

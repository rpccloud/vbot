import React from "react";

import { Button } from 'antd';
import VLayout from "./VLayout";
import HLayout from "./HLayout";
import Divider from "./Divider";
import VSpacer from "./VSpacer";


const styles = {
    title: {
        marginTop: 6,
        fontSize: "var(--FontSizeLarge)",
    },
    container: {
        width: 420,
        height: 360,
        margin: 120,
        background: "var(--PrimaryBGColorLighten)",
        padding: "16px 24px 16px 24px",
    },
    button: {
        marginRight: 8,
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "var(--PrimaryBGColorDarken)",
        marginTop: 8,
        marginBottom: 8,
    },
}


interface CardProps {
    title: string,
    prevName?: string,
    nextName?: string,
    canPrev?: boolean,
    canNext?: boolean,
    onPrev?: () => void,
    onNext?: () => void,
    onKeyDown?: (e: any) => void,
    children: any,
}

const Card = (props: CardProps) => {
    const buttonPrev = props.prevName ? (
        <Button
            type="primary"
            ghost={true}
            disabled={props.canPrev === false}
            onClick={props.onPrev}
            style={styles.button}
        >
            {props.prevName}
        </Button>
    ) : null

    const buttonNext = props.nextName ? (
        <Button
            type="primary"
            ghost={true}
            disabled={props.canNext === false}
            onClick={props.onNext}
        >
            {props.nextName}
        </Button>
    ): null

    return (
        <div
            className="vbot-container-round vbot-container-shadow"
            style={styles.container}
            onKeyDown={props.onKeyDown}
        >
            <VLayout.Container>
                <VLayout.Fixed>
                    <div style={styles.title}>
                        {props.title}
                    </div>
                </VLayout.Fixed>
                <Divider style={styles.divider} />
                <VLayout.Dynamic>
                    {props.children}
                </VLayout.Dynamic>
                <Divider style={styles.divider} />
                <VSpacer size={4} />
                <VLayout.Fixed>
                    <HLayout.Container>
                        <HLayout.Dynamic />
                        {buttonPrev}
                        {buttonNext}
                    </HLayout.Container>
                </VLayout.Fixed>
            </VLayout.Container>
        </div>
    )
}

export default Card

import React from "react";

import { Button } from 'antd';

const styles = {
    header: {
        height: 50,
        color: "var(--Vbot-FontColor)",
        fontSize: "var(--Vbot-FontSizeLarge)",
        borderBottom: "1px solid var(--Vbot-DividerColor)",
        display: "flex",
        alignItems: "center",
    },
    container: {
        border: "1px solid var(--Vbot-DividerColor)",
        backgroundColor: "var(--Vbot-BackgroundColorLighten)",
        padding: "0px 24px 0px 24px",
        display: "flex",
        flexFlow: "column"
    },
    button: {
        marginRight: 8,
    },
    footer: {
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        flexFlow: "row",
        alignItems: "center",
        borderTop: "1px solid var(--Vbot-DividerColor)",
    },
}

interface CardProps {
    title: string,
    width?: number,
    height?: number,
    prevName?: string,
    nextName?: string,
    canPrev?: boolean,
    canNext?: boolean,
    onPrev?: () => void,
    onNext?: () => void,
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

    let containerStyle: any = {...styles.container}

    if (props.width !== undefined) {
        containerStyle.width = `${props.width}px`
    }

    if (props.height !== undefined) {
        containerStyle.height = `${props.height}px`
    }

    return (
        <div className="vbot-container-round vbot-container-shadow" style={containerStyle}>
            <div style={styles.header}>
                <div>{props.title}</div>
            </div>

            <div style={{display: "flex", flex:"1 0 0", flexFlow: "column"}}>
                {props.children}
            </div>

            <div style={styles.footer}>
                <div style={{flex:"1 0 0"}}></div>
                {buttonPrev}
                {buttonNext}
            </div>
        </div>
    )
}

export default Card

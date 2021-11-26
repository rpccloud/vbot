import React from "react";
import { makeTransition, UIState, UIStateConfig } from "..";
import { Theme } from "../theme";

interface BackgroundProps {
    theme: Theme;
    isFocus: boolean;
    focusInset: number;
    borderWidth: number;
    borderRadius: number;
    uiState: UIState;
    uiBorder: UIStateConfig;
    uiBackground: UIStateConfig;
    uiShadow: UIStateConfig;
    uiOpacity: { hover: number; active: number };
}

export const Background = (props: BackgroundProps) => {
    const {
        theme,
        isFocus,
        focusInset,
        borderWidth,
        borderRadius,
        uiState,
        uiBorder,
        uiBackground,
        uiShadow,
        uiOpacity,
    } = props;

    const transition = makeTransition(
        ["opacity", "backgroundColor", "border", "box-shadow"],
        theme.transition.durationMS + "ms",
        theme.transition.easing
    );

    return uiState.isDisabled ? (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transition: transition,
                boxSizing: "border-box",
                backgroundColor: uiBackground.disabled,
                border: `${borderWidth}px solid ${uiBorder.disabled}`,
                borderRadius: borderRadius,
                boxShadow: uiShadow.disabled,
            }}
        />
    ) : (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transition: transition,
                boxSizing: "border-box",
                backgroundColor: uiBackground.normal,
                border: `${borderWidth}px solid ${uiBorder.normal}`,
                borderRadius: borderRadius,
                boxShadow: uiShadow.normal,
            }}
        >
            {uiState.isHover ? (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        transition: transition,
                        boxSizing: "border-box",
                        opacity: uiOpacity.hover,
                        backgroundColor: uiBackground.hover,
                        border: `${borderWidth}px solid ${uiBorder.hover}`,
                        borderRadius: borderRadius,
                        boxShadow: uiShadow.hover,
                    }}
                />
            ) : null}
            {uiState.isActive ? (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        transition: transition,
                        boxSizing: "border-box",
                        opacity: uiOpacity.active,
                        backgroundColor: uiBackground.active,
                        border: `${borderWidth}px solid ${uiBorder.active}`,
                        borderRadius: borderRadius,
                        boxShadow: uiShadow.active,
                    }}
                />
            ) : null}
            {uiState.isSelected ? (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        transition: transition,
                        boxSizing: "border-box",
                        backgroundColor: uiBackground.selected,
                        border: `${borderWidth}px solid ${uiBorder.selected}`,
                        borderRadius: borderRadius,
                        boxShadow: uiShadow.selected,
                    }}
                />
            ) : null}
            {isFocus ? (
                <div
                    style={{
                        position: "absolute",
                        inset: focusInset,
                        transition: transition,
                        boxSizing: "border-box",
                        border: `${theme.focus.borderWidth}px solid ${theme.focus.borderStyle}`,
                        borderRadius: borderRadius,
                    }}
                />
            ) : null}
        </div>
    );
};

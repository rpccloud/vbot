import React from "react";

interface ZIndex {
    zIndex: number;
}

export const ZIndexContext = React.createContext<ZIndex>({
    zIndex: 0,
});

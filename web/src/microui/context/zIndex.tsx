import React from "react";

export const ZIndexContext = React.createContext<{
    zIndex: number;
}>({
    zIndex: 0,
});

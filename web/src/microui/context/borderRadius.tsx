import React from "react";

export const BorderRadiusContext = React.createContext<{
    borderRadius: number;
}>({
    borderRadius: 6,
});

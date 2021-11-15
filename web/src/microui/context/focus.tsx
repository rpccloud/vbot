import React from "react";

export const FocusContext = React.createContext<{
    focusable: boolean;
}>({
    focusable: true,
});

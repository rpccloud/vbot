import React from "react";

interface Focus {
    focusable: boolean;
}

export const FocusContext = React.createContext<Focus>({
    focusable: true,
});

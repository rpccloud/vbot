import React from "react";
import { sizeKind } from "../util";

interface Size {
    size: sizeKind;
}

export const SizeContext = React.createContext<Size>({
    size: "medium",
});

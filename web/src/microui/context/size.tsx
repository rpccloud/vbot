import React from "react";
import { Size } from "../util";

export const SizeContext = React.createContext<{
    size: Size;
}>({
    size: "medium",
});

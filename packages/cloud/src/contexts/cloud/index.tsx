import React from "react";

import { ICloudContext } from "./ICloudContext";

export const CloudContext = React.createContext<ICloudContext>({});

export const CloudContextProvider: React.FC<ICloudContext> = ({
    baseUrl,
    clientId,
    children,
}) => {
    return (
        <CloudContext.Provider
            value={{
                baseUrl,
                clientId,
            }}
        >
            {children}
        </CloudContext.Provider>
    );
};

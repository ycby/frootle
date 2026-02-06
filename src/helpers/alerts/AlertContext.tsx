import {createContext, useContext, useState, Context} from "react";
import {AlertContainer} from "#root/src/helpers/alerts/AlertContainer.tsx";
import {Variant} from "react-bootstrap/types";


export interface AlertContent {
    name?: string;
    message: string;
    type: Variant;
    duration?: number;
}

interface AlertContextType {
    alerts: AlertContent[];
    addAlert: (newAlert: AlertContent) => void;
    removeAlert: (index: number) => void;
}

const AlertContext: Context<AlertContextType> = createContext<AlertContextType>({
    alerts: [],
    addAlert: (_: AlertContent) => null,
    removeAlert: (_: number) => null
});

const useAlert = () => {
    return useContext(AlertContext);
}

const AlertProvider = ({children}: any) => {

    const [alerts, setAlerts] = useState<AlertContent[]>([]);

    const addAlert = (newAlert: AlertContent) => {

        setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    }

    const removeAlert = (index: number) => {

        setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
    }

    return (
        <AlertContext
            value={{
                alerts,
                addAlert,
                removeAlert,
            }}
        >
            <AlertContainer />
            {children}
        </AlertContext>
    );
};

export {
    useAlert,
    AlertProvider,
}
import {createContext, useContext, useState, Context} from "react";
import {AlertContainer} from "#root/src/helpers/alerts/AlertContainer.tsx";
import {Variant} from "react-bootstrap/types";


export interface AlertContent {
    id: string;
    name?: string;
    message: string;
    type: Variant;
    duration?: number;
}

interface AlertContextType {
    alerts: AlertContent[];
    addAlert: (newAlert: Omit<AlertContent, 'id'>) => void;
    removeAlert: (index: string) => void;
}

const AlertContext: Context<AlertContextType> = createContext<AlertContextType>({
    alerts: [],
    addAlert: (_: Omit<AlertContent, 'id'>) => null,
    removeAlert: (_: string) => null
});

const useAlert = () => {
    return useContext(AlertContext);
}

const AlertProvider = ({children}: any) => {

    const [alerts, setAlerts] = useState<AlertContent[]>([]);

    const addAlert = (newAlert: Omit<AlertContent, 'id'>) => {

        setAlerts((prevAlerts) => [...prevAlerts, {...newAlert, id: crypto.randomUUID()}]);
    }

    const removeAlert = (id: string) => {

        setAlerts((prevAlerts) => prevAlerts.filter((alertContent) => alertContent.id !== id));
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